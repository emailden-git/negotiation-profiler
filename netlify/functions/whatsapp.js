exports.handler = async () => {
  const number = '85291311484'; // Replace with your number (no + or spaces)
  const message = encodeURIComponent(
    "Hi! I'd like to enquire about Negotiation Training and Coaching."
  );

  return {
    statusCode: 302,
    headers: {
      Location: `https://wa.me/${number}?text=${message}`,
    },
  };
};
