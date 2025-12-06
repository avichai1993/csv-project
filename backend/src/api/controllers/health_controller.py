"""Health Controller - Health check endpoint handler.

Called by Connexion based on operationId: get_health
"""

import logging
from datetime import datetime, timezone

from flask import g

logger = logging.getLogger(__name__)


def get_health() -> tuple[dict, int]:
    """Handle GET /api/health - Health check endpoint.
    
    Returns:
        Tuple of (response_dict, status_code)
    """
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Health check requested")
    
    response = {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    return response, 200
