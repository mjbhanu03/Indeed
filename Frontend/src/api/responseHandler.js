export const normalizeResponse = (response) => {
  console.log("response handler", response)
  switch (response.code) {
    case 1:
      return response;

    case 3:
      return null;

    case 2:
      throw new Error(response.errors);

    case 0:
      // throw new Error(response.message);
      return response

    case -1:
      throw new Error("Unauthorized");

    default:
      throw new Error("Unexpected Server Response");
  }
};