exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.restaurantBoard = (req, res) => {
  res.status(200).send("Restaurant Content.");
};

exports.suspendAccount = (req, res) => {
  res.status(200).send("Suspend Content.");
}
