from rest_framework.exceptions import APIException


class InvalidFileFormat(APIException):
    status_code = 400
    default_detail = "Invalid data in GPX file"
    default_code = "invalid_gpx_file"


class IncorrectValues(Exception):
    pass
