#!/usr/bin/env python3
"""Minimal dev server that proxies the remote event feed to avoid CORS issues."""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler
from socketserver import ThreadingTCPServer

EVENTS_URL = os.environ.get(
    "EVENTS_URL", "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json"
)
PORT = int(os.environ.get("PORT", "8000"))


class EventRequestHandler(SimpleHTTPRequestHandler):
    """Serves static files and exposes /events as a same-origin proxy."""

    def do_GET(self):
        if self.path.rstrip("/") == "/events":
            self._handle_events()
            return
        super().do_GET()

    def _handle_events(self):
        try:
            req = urllib.request.Request(
                EVENTS_URL, headers={"Accept": "application/json", "User-Agent": "UKDailyEvent/1.0"}
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                payload = response.read()
                content_type = response.headers.get("Content-Type", "application/json")
                status = HTTPStatus.OK
        except urllib.error.HTTPError as exc:
            payload = json.dumps({"error": exc.reason, "status": exc.code}).encode("utf-8")
            content_type = "application/json"
            status = HTTPStatus(exc.code)
        except urllib.error.URLError as exc:
            payload = json.dumps({"error": str(exc.reason)}).encode("utf-8")
            content_type = "application/json"
            status = HTTPStatus.BAD_GATEWAY
        except Exception as exc:  # pragma: no cover - unexpected failure
            payload = json.dumps({"error": str(exc)}).encode("utf-8")
            content_type = "application/json"
            status = HTTPStatus.INTERNAL_SERVER_ERROR

        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)


def serve(directory: str) -> None:
    handler = lambda *args, **kwargs: EventRequestHandler(*args, directory=directory, **kwargs)
    ThreadingTCPServer.allow_reuse_address = True
    with ThreadingTCPServer(("0.0.0.0", PORT), handler) as httpd:
        print(f"Serving {directory} at http://localhost:{PORT} (proxying {EVENTS_URL})")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server")


if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.dirname(__file__) or ".")
    try:
        serve(base_dir)
    except OSError as exc:
        print(f"Unable to start server: {exc}", file=sys.stderr)
        raise
