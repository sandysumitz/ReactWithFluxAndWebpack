import swal from "sweetalert";
class alert {
  confirmationBox = (title, callback) => {
    swal({
      title: title,
      buttons: true,
    }).then((value) => {
      console.log("valuee---", value);
      callback();
    });
  };
}
export default alert;
