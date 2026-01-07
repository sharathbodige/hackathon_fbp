import logging
import sys
import os
from loguru import logger

class InterceptHandler(logging.Handler):
    def emit(self, record):
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where originated the logged message
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())

def setup_logging():
    # Intercept standard logging
    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
    
    # Remove default Loguru handler
    logger.remove()
    
    # Add Standard Output
    logger.add(sys.stdout, format="{time} | {level} | {message}", level="INFO")
    
    # Add File Logging with robustness for Windows
    try:
        os.makedirs("logs", exist_ok=True)
        logger.add(
            "logs/app.log",
            rotation="100 MB",
            retention="10 days",
            compression="zip",
            serialize=True,
            enqueue=True,
            delay=True  # Don't open file until first log
        )
    except Exception as e:
        print(f"Warning: Could not initialize file logging: {e}")

    # Disable some noisy loggers
    for name in ["uvicorn.access", "uvicorn.error", "sqlalchemy.engine"]:
        logging_logger = logging.getLogger(name)
        logging_logger.handlers = [InterceptHandler()]
        logging_logger.propagate = False
