export const createUser = async (userObject: {}) => {
  try {
    const response = await fetch(`http://localhost:4000/users`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userObject),
    });
    const dataFetched = await response.json();
    return dataFetched;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};
