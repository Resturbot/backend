
const message_wit  = (message) => {
  client.message(message, {}, (error, data) => {
    if (error) {
      console.log('Oops! Got an error: ' + error);
      return "Try a different question."
    } else {
      console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
      let message = data.entities.location.value;
      return JSON.stringify(message);
    }
  });
}
