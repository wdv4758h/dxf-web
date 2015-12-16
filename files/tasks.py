from __future__ import print_function
from dxf_to_nurbs import rdxf

from celery import shared_task

from io import StringIO
from tempfile import NamedTemporaryFile
import subprocess
import sys
import os.path


@shared_task
def calc_length(fileobject):
    print('=' * 20)

    ########################################
    # DXF to NURBS
    ########################################

    buffer = StringIO()
    stdout = sys.stdout
    sys.stdout = buffer

    rdxf(fileobject.dxf_file.path)

    sys.stdout = stdout

    fileobject.nurbs = buffer.getvalue()
    fileobject.nurbs_finish = True
    fileobject.save()

    ########################################
    # Length Calculation
    ########################################

    # need to place "calc_distance" binary under the same folder

    with NamedTemporaryFile() as f:
        f.write(fileobject.nurbs)
        f.flush()
        p = subprocess.Popen([os.path.join(os.path.dirname(os.path.realpath(__file__)), 'calc_distance'), f.name],
                             stdout=subprocess.PIPE)
        p.wait()
        result = p.stdout.read()
        lengths = filter(lambda x: 'length' in x, result.split('\n'))
        total = sum(float(i.split()[-1]) for i in lengths)
        fileobject.length = total

    fileobject.length_finish = True
    fileobject.save()

    print('total length is: {}'.format(fileobject.length))
    print('=' * 20)
