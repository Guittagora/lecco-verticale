"""Server locale per il sito: come `python3 -m http.server`, ma dice al browser
di non tenere copie vecchie dei file, così le modifiche si vedono subito.

Uso:  python3 serve.py [porta]    (porta predefinita: 8000)
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class SenzaCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Sito su http://localhost:{porta}  (Ctrl+C per fermare)")
    ThreadingHTTPServer(("", porta), SenzaCache).serve_forever()
