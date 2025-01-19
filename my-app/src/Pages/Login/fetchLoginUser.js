const fetchLoginUser = async (token, setLoginUser) => {
    try {
        // Decode the token to extract user information
        const tokenParts = token.split('.'); // Token is split into three parts: header, payload, and signature
        if (tokenParts.length !== 3) {
            throw new Error('Invalid token format'); // If the token doesn't have 3 parts, it's invalid
        }
        const encodedPayload = tokenParts[1]; // Get the payload part of the token
        const decodedPayload = atob(encodedPayload); // Decode the base64 encoded payload
        const payloadObj = JSON.parse(decodedPayload); // Parse the decoded payload into a JavaScript object

        // Support both userId and _id for flexibility
        const id = payloadObj.userId || payloadObj._id; // Retrieve userId or _id from the payload

        if (!id) {
            throw new Error('User ID is missing in token payload'); // If neither userId nor _id are found, throw an error
        }

        // Send a GET request to fetch user details from the server
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'GET', // HTTP method is GET
            headers: {
                'Content-Type': 'application/json', // Specify the content type
                'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
            },
        });

        if (response.ok) {
            const userData = await response.json(); // If the request is successful, parse the user data
            setLoginUser(userData); // Set the user data in the state
        } else {
            console.error(`Failed to fetch user: ${response.status}`); // If the request fails, log the error status
        }
    } catch (error) {
        console.error('Error fetching user:', error); // Catch and log any errors that occur during the process
    }
};

export default fetchLoginUser;
