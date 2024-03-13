import { useRef, useState } from "react";
import UploadAndDisplayImage from "../uploadAndDisplayImage/UploadAndDisplayImage";

function EditUserModal({ loggedinUser, logOut }) {
  const [selectedImage, setSelectedImage] = useState(loggedinUser.image);
  // const [savedImage, setSavedImage] = useState(null);
  const addedImg = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Extract base64 encoded string and set it as state
      const imageDataURL = reader.result;
      const base64String = imageDataURL.split(",")[1];
      setSelectedImage(base64String);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  async function edit() {
    let checkPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/;
    if (newPassword.current.value === "") {
      alert("You must fill all fields!");
      return false;
    }
    if (!newPassword.current.value.match(checkPassword)) {
      alert(
        "Password must contain:\n-at least 8 characters\n-uppercase letters\n-lowercase letters\n-numbers"
      );
      return false;
    }
    const data = await fetch(
      "http://localhost:12345/api/users/" + loggedinUser.username,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword.current.value,
          profileImg: selectedImage,
        }),
      }
    );
  }
  const newPassword = useRef(null);
  async function deleteUser() {
    console.log("edditing password to " + newPassword.current.value);
    const data = await fetch(
      "http://localhost:12345/api/users/" + loggedinUser.username,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    logOut();
  }
  // const search = function () {
  //   if (Postable()) {
  //     content.current.className = "btn btn-primary";
  //   } else {
  //     content.current.className = "btn btn-primary disabled";
  //   }
  // };
  return (
    <div
      className="modal fade"
      id="editUserModal"
      tabIndex="100002"
      aria-labelledby="opendPostLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Edit your user</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <input
                  type="password"
                  ref={newPassword}
                  // onChange={search}
                  className="form-control"
                  data-testid="create-post-text-test"
                  id="create-post-text"
                  placeholder="Enter a new password"
                ></input>
              </div>
              <div className="input-group">
                <UploadAndDisplayImage
                  addedImg={addedImg}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              </div>
            </form>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={edit}
              style={{ marginBlockStart: "20px" }}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-danger float-end"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={deleteUser}
              style={{ marginBlockStart: "20px" }}
            >
              Delete user
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditUserModal;
