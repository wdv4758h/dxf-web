from celery import shared_task


@shared_task
def calc_length(filepath):
    # your calculation
    return 0.0
