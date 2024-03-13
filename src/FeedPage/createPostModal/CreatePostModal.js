import { useRef, useState } from "react";
import UploadAndDisplayImage from "../../CrossScreensElements/modals/uploadAndDisplayImage/UploadAndDisplayImage";

function CreatePostModal({
  addPost,
  postNum,
  composer,
  profilePic,
  gotToken,
  loggedinUser,
}) {
  const [date, setDate] = useState(getCurrentTime());
  function getCurrentTime() {
    let now = new Date();
    let hourOfDay = now.getHours();
    let minute = now.getMinutes();

    // Format the time
    let formattedTime = `${String(hourOfDay).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;

    // Get the current date
    let date = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // Construct the final string
    // setDate(`${formattedTime}, ${date}`);
    return `${formattedTime}, ${date}`;
  }

  let imgWasAdded = false;
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedImage, setSavedImage] = useState(null);

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
  const content = useRef(null);

  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
  };
  const Postable = function () {
    if (postText.current.value.trim() == "") {
      return false;
    } else {
      return true;
    }
  };
  const postText = useRef(null);
  const search = function () {
    if (Postable()) {
      content.current.className = "btn btn-primary";
    } else {
      content.current.className = "btn btn-primary disabled";
    }
  };
  const postSetter = function () {
    const post = {
      id: postNum,
      author: composer,
      profilePic: profilePic,
      published: date,
      content: postText.current.value,
      contains_img: imgWasAdded,
      imageView: selectedImage,
      numOfLikes: 0,
      comments: new Array(),
      usersWhoLiked: [],
    };
    create();
    addPost(post);
    postText.current.value = "";
    setSelectedImage(null);
    search();
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////
  async function create() {
    // await getCurrentTime();
    console.log("date is" + date);
    let data;
    if (selectedImage) {
      data = await fetch(
        "http://localhost:12345/api/users/" + loggedinUser.username + "/posts",
        {
          method: "POST",
          // Remove the Content-Type header
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + gotToken,
          },
          body: JSON.stringify({
            author: composer,
            profilePic: profilePic,
            content: postText.current.value,
            published: date,
            contains_img: imgWasAdded,
            imageView: selectedImage,
            numOfLikes: 0,
            comments: new Array(),
          }),
        }
      );
    } else {
      data = await fetch(
        "http://localhost:12345/api/users/" + loggedinUser.username + "/posts",
        {
          method: "POST",
          // Remove the Content-Type header
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + gotToken,
          },
          body: JSON.stringify({
            author: composer,
            content: postText.current.value,
            published: date,
            contains_img: imgWasAdded,
            numOfLikes: 0,
            comments: new Array(),
          }),
        }
      );
    }
    const posts = await data.json();
    console.log(posts);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div
      className="modal fade"
      id="create-post"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Create post
            </h1>
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
                <textarea
                  ref={postText}
                  onChange={search}
                  className="form-control"
                  data-testid="create-post-text-test"
                  id="create-post-text"
                  placeholder="Enter some text for the post"
                ></textarea>
              </div>
              <div className="input-group">
                <UploadAndDisplayImage
                  addedImg={addedImg}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              </div>
            </form>
          </div>
          <div className="textAlignC">
            <button
              type="button"
              ref={content}
              className="btn btn-primary disabled"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={postSetter}
              style={{ marginBottom: "12px" }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;
