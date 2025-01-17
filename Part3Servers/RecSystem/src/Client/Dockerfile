# Base Python image
FROM python:3.10-slim

# Set working directory in the container
WORKDIR /usr/src/netflix-client

# Copy the client script
COPY Client.py .

# Default to running client.py
ENTRYPOINT ["python", "Client.py"]