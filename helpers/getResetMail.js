export default (username, header, resetLink) => `
<h2 style=" text-align:justify";margin-left:50%;
padding:15px">
LearnGround Password Reset</h2><br>
Hi ${username},
<p>
We received a request to reset your password.
<p>
Click <a href="${resetLink}">here to change your password.</a>
<p>
If you did not request for a password change, ignore this mail.
`;
