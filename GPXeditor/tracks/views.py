from django.http import HttpResponse


# function for parsing and saving data from gpx file to our database
# function is called after the gpx_file is uploaded
def index(request):
    return HttpResponse("Hello from views.")
