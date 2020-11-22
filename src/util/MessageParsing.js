/**
 * Returns true if the message has the appropriate GPS fields
 * @param {Object} message the message to consider
 */
const isGPSMessage = (message) => {
  const { gps_id, latitude, longitude, groundspeed, truecourse } = message;
  return gps_id && latitude && longitude && groundspeed && truecourse;
}

/**
 * Returns true if message has appropriate CAN fields
 * @param {Object} message the message to check
 */
const isCANMessage = (message) => {
  const {message_id, dlc, payload} = message;
  return message_id && dlc && payload;
}


module.exports = { isGPSMessage, isCANMessage };