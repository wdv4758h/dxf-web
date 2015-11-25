from celery import shared_task


@shared_task
def calc_length(fileobject):
    print('=' * 20)
    # your calculation
    # fileobject.file
    fileobject.length = 42
    fileobject.save()
    print('total length is: {}'.format(fileobject.length))
    print('=' * 20)
