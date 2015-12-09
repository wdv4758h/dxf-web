from dxf_to_nurbs import rdxf

from celery import shared_task

from io import StringIO
import subprocess
import sys


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

    # your calculation
    # fileobject.file

    fileobject.length = 42
    fileobject.length_finish = True
    fileobject.save()

    print('total length is: {}'.format(fileobject.length))
    print('=' * 20)
