export default {
  validateUUID: (uuid) => {
    // eslint-disable-next-line max-len
    const validate = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (validate.test(uuid)) {
      return true;
    }
    return false;
  },
};
