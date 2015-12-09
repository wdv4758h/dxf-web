#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function
from __future__ import unicode_literals

import numpy as np
import dxfgrabber

def rdxf(filename):
    dxf = dxfgrabber.readfile(filename)

    x_max, x_min, y_max, y_min = -float('inf'), float('inf'), -float('inf'), float('inf')

    for e in dxf.entities:

        typename = e.dxftype
        print(typename)

        if typename == 'LWPOLYLINE':

            # update boundary
            x_max, y_max = np.max((np.max(e.points, 0), (x_max, y_max)), 0)
            x_min, y_min = np.min((np.min(e.points, 0), (x_min, y_min)), 0)

        elif typename == 'LINE':

            # update boundary
            x_max, y_max = np.max((np.max((e.start, e.end), 0), (x_max, y_max)), 0)
            x_min, y_min = np.min((np.min((e.start, e.end), 0), (x_min, y_min)), 0)

        elif typename == 'SPLINE':

            # update boundary
            cpoints = np.array(e.controlpoints)
            x_max, y_max = np.max((np.max(cpoints[:, (0,1)], 0), (x_max, y_max)), 0)
            x_min, y_min = np.min((np.min(cpoints[:, (0,1)], 0), (x_min, y_min)), 0)

            print('n_ctrlp: %d' % len(e.controlpoints))
            w = e.weights
            for (i, pt) in enumerate(e.controlpoints):
                print('ctrlp: %f %f %f' % (pt[0]*w[i], pt[1]*w[i], pt[2]*w[i]))
            for (index, knot) in enumerate(e.knots):
                print('knot: %f' % (knot))
            print('u_min: %f' % e.knots[0])
            print('u_max: %f' % e.knots[-1])
            pass

        else:

            print('Not Implemented')

    print('x_max: {}\ny_max: {}'.format(x_max, y_max))
    print('x_min: {}\ny_min: {}'.format(x_min, y_min))


if __name__ == '__main__':
    import sys
    rdxf(sys.argv[1])
