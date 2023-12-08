const {VITE_API_URL} = import.meta.env


export const createUser = async (userObject: {}) => {
  try {
    const response = await fetch(`${VITE_API_URL}/users`, {
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
