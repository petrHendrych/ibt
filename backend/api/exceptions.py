"""Custom file response code

Create exception when file contains empty tracks
"""

from rest_framework.exceptions import APIException

__author__ = 'Petr Hendrych'
__email__ = 'xhendr03@fit.vutbr.cz'


class InvalidFileFormat(APIException):
    status_code = 200
    default_detail = "GPX file contained some invalid tracks"
    default_code = "invalid_gpx_file"


class EmptyTracks(Exception):
    pass
