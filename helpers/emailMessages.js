export default {
  registerMessage(Url) {
    const html = `<h1 style=" text-align:justify";margin-left:50%;
          padding:15px">
          Welcome To LearnGround </h1><br>
          <h3 style=" text-align:justify";margin-left:50%>
            The Den Of Great Ideas
          </h3>
          <strong style=" text-align:justify";margin-left:50%>
          Your Registration was successful </strong><br>
          <strong style=" text-align:justify";margin-left:50%>
          Click <a href="${Url}">Activate</a> to activate
          your account
          </strong><br>`;
    return html;
  },

  requestMentorshipMessage(requestUsername) {
    const html = `<h1 style=" text-align:justify";margin-left:50%;
          padding:15px">
           LearnGround </h1><br>
          <h3 style=" text-align:justify";margin-left:50%>
            The Den Of Great Ideas
          </h3>
          <strong style=" text-align:justify";margin-left:50%>
          ${requestUsername} has just requested to be a mentor </strong><br>
          </strong><br>`;
    return html;
  },

  rejectMentorshipMessage(requestUsername) {
    const html = `<h1 style=" text-align:justify";margin-left:50%;
          padding:15px">
           LearnGround </h1><br>
          <h3 style=" text-align:justify";margin-left:50%>
            The Den Of Great Ideas
          </h3>
          <strong style=" text-align:justify";margin-left:50%> Hi
          ${requestUsername},  your request to be a mentor was rejected
          </strong><br>
          </strong><br>`;
    return html;
  },

  acceptMentorshipMessage(requestUsername) {
    const html = `<h1 style=" text-align:justify";margin-left:50%;
          padding:15px">
           LearnGround </h1><br>
          <h3 style=" text-align:justify";margin-left:50%>
            The Den Of Great Ideas
          </h3>
          <strong style=" text-align:justify";margin-left:50%> Hi
          ${requestUsername}, your request to be a mentor has been aproved
          </strong><br>`;
    return html;
  }
};
