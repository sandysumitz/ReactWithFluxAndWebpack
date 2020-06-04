import react from "react";

class Modal extends react.Component {

    closeModal = () => {

    }

    // When the user clicks anywhere outside of the modal, close it
    Window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }   

    render() {
        return(
            <div id="myModal" class="modal">

                {/* <!-- Modal content --> */}
                <div class="modal-content">
                    <span 
                        class="close"
                        onClick={this.closeModal}>
                            &times;
                    </span>
                    <p>Some text in the Modal..</p>
                </div>

            </div>
        );
    }
}
export default Modal;