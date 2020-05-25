from rest_framework.exceptions import APIException


class InvalidFileFormat(APIException):
    status_code = 200
    default_detail = "GPX file contained some invalid tracks"
    default_code = "invalid_gpx_file"


class EmptyTracks(Exception):
    pass
