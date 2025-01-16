import socket
import sys

def main():
    # Ensure the correct number of arguments are provided
    if len(sys.argv) != 3:
        print("Usage: python client.py <server_ip> <server_port>")
        sys.exit(1)

    # Retrieve server IP and port from command-line arguments
    dest_ip = sys.argv[1]  # Server IP address
    try:
        dest_port = int(sys.argv[2])  # Server port, converted to an integer
    except ValueError:
        print("Port must be an integer.")  # Handle invalid port input
        sys.exit(1)

    # Create a TCP socket using IPv4
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Attempt to connect to the server
    try:
        s.connect((dest_ip, dest_port))  # Connect to the specified server
    except ConnectionError as e:
        print(f"Failed to connect to server: {e}")  # Handle connection errors
        sys.exit(1)

    # Start communication loop with the server
    
    while True:  # Loop until user quits or interrupts
        try:
            msg = input("") + "\n"  # Append a newline to the message
            s.send(msg.encode('utf-8'))  # Send the message to the server
            data = s.recv(4096).decode('utf-8')  # Receive and decode response
            print(data)
        except UnicodeEncodeError as e:
            print(f"Encoding error in message: {e}")
            break

    # Close the connection
    s.close()

# Entry point for the script
if __name__ == "__main__":
    main()
