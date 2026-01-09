import uuid
import time
from fastapi import Request
from loguru import logger

async def request_log_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    start_time = time.time()
    
    # Process the request
    response = await call_next(request)
    
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = "{0:.2f}ms".format(process_time)
    
    logger.info(
        f"rid={request_id} method={request.method} path={request.url.path} "
        f"status={response.status_code} time={formatted_process_time}"
    )
    
    response.headers["X-Request-ID"] = request_id
    return response
