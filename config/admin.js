module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '5f3464f7b34b473f99e7b7c590667e5a'),
  },
});
