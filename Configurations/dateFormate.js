
const date = new Date();

const dateFormate = `${date.getFullYear()}/${
  date.getMonth() + 1
}/${date.getDate()}`;

module.exports = dateFormate;