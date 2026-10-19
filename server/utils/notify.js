const Notification = require('../models/Notification');
async function notify(recipient, type, title, message, relatedId = null) {
  if (!recipient) return;
  await Notification.create({ recipient, type, title, message, relatedId });
}
module.exports = notify;
