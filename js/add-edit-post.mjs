import utils from "./utils.js";
import postApi from "./api/postApi.js";

// add or edit
// Add------
// random banner
// handle submit
// handle change img click
// Edit-------------
// Get post by id
// fill data form
// handle submit
// handle change img click


// tranh viet nhu the nay no se hieu la globle, vi ai cung co the thay doi dc
// const mode = '';

// // bien a no se hieu block scope (bien cuc bo)
// {
//     const a = '';
// }


const randomNumber = () => {
    // const 
    const temp = Math.trunc(Math.random() * (2000 - 100));
    return temp + 100;
}

const randonBannerImage = () => {
    const randomId = randomNumber();
    const bannerUrl = `https://picsum.photos/id/${randomId}/1368/400`;
    utils.setBackgroundImageByElementId('postHeroImage', bannerUrl);
};

const getPostFormValue = () => {
    return {
        title: utils.getValueByElementId('postTitle'),
        author: utils.getValueByElementId('postAuthor'),
        description: utils.getValueByElementId('postDescription'),
        imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
    }
}

const setPostFormValue = (curPost) => {
    utils.setValueByElementId('postTitle', curPost.title);
    utils.setValueByElementId('postAuthor', curPost.author);
    utils.setValueByElementId('postDescription', curPost.description);
    utils.setBackgroundImageByElementId('postHeroImage', curPost.imageUrl);
}

const validtePostForm = (formValue) => {
    let inValid = true;
    // check title  
    if (formValue.title.trim() === '') {
        inValid = false;
        utils.addClassByElementId('postTitle', ['is-invalid']);
    }
    // check author
    if (formValue.author.trim() === '') {
        inValid = false;
        utils.addClassByElementId('postAuthor', ['is-invalid']);
    }
    return inValid;
}

const resetValidationError = () => {
    utils.removeClassByElementId('postTitle', ['is-invalid']);
    utils.removeClassByElementId('postAuthor', ['is-invalid']);
}

const updateNewPost = (curPost, newPost) => {
    curPost.title = newPost.title;
}

const handlePostFormSubmit = async (e, postId) => {
    // prevent reload page
    e.preventDefault();
    // reset validation error
    resetValidationError();

    // get form value
    const formValue = getPostFormValue();
    // console.log(formValue);
    if (!postId) {
        const isValid = validtePostForm(formValue);
        // require title = author
        if (!isValid) return;

        try {
            // call api to create a new post
            const post = await postApi.add(formValue);
            // thuc te se thiet ke giao dien thong bao ko su dung alert
            alert('Add new post successfullly');
            // Redirect edit mode
            const editPostUrl = `add-edit-post.html?postId=${post.id}`;
            // chuyen sang trang moi co dia chi editPostUrl
            window.location = editPostUrl;
        } catch (error) {
            alert(`Faile to add new post: ${error}`);
        }
        // Inform user post created
    } else {
        // Update existing post with field that has changes. Don't include unchanged properties inside payload.
        try {
            // Do nothing if user doesn't change anything.
            const curPost = await postApi.getDetail(postId);
            if (curPost.title !== formValue.title || curPost.author !== formValue.author) {
                const isValid = validtePostForm(formValue);
                // require title = author
                if (!isValid) return;
            }
            updateNewPost(curPost, formValue);
            await postApi.update(curPost);
            // If update successfully, show an alert with message Save post successfully.
            alert('Uppdate new post successfullly');
        } catch (error) {
            // If failed, show an alert with error message.
            throw error;
        }
    }
};

// MAIN LOGIC

const init = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('postId');
        const mode = postId ? 'edit' : 'add';

        if (mode === 'add') {
            // random banner img
            randonBannerImage();
        } else {
            const curPost = await postApi.getDetail(postId);
            setPostFormValue(curPost);
        }

        // Bind events: form submit + change banner img
        const postFrom = utils.getElementById('postForm');
        if (postFrom) {
            postFrom.addEventListener('submit', (e) => handlePostFormSubmit(e, postId));
        }

        const changePostBannerButton = document.querySelector('#postChangeImage');
        if (changePostBannerButton) {
            changePostBannerButton.addEventListener('click', randonBannerImage);
        }
    } catch (error) {
        throw error;
    }
};

init();