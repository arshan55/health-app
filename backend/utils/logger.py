import logging
import sys
import os

def setup_logger():
    """Sets up a centralized logger with Google Cloud Logging for production telemetry."""
    if os.environ.get("K_SERVICE"): # Only init Google Cloud Logging if running in Cloud Run
        import google.cloud.logging
        client = google.cloud.logging.Client()
        client.setup_logging()
    else:
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            stream=sys.stdout
        )
    
    # Minimize noise from third-party libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("google").setLevel(logging.WARNING)
