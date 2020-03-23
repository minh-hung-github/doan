'use strict';
import AppConstants from './appConstants.js';
import postApi from './api/postApi.js';
import utils from './utils.js';

const handleEditButton = (e, post) => {
  //if (!post.id) return;
  window.location = `add-edit-post.html?postId=${post.id}`;
  e.stopPropagation();
}

const handleRemovePost = (liElement, post) => {
  // const postListElement = document.querySelector('#postsList');
  const confirmMessage = 'You\'re going delete this post. really?';
  if (window.confirm(confirmMessage)) {
    //postListElement.removeChild(liElement);
    //liElement.parentNode.removeChild(liElement);
    liElement.remove();
    postApi.remove(post.id);
  }
}

const actionlinkPost = (e, post) => {
  window.location = `post-detail.html?postId=${post.id}`;
}

const buildLiElement = (post) => {
  const templateElement = utils.getElementById('postItemTemplate');
  const templteFragment = templateElement.content.cloneNode(true);
  const liElement = templteFragment.querySelector('li');
  if (liElement) {
    liElement.addEventListener('click', (e) => actionlinkPost(e, post));
    const imgElement = liElement.querySelector('#postItemImage');
    if (imgElement) {
      imgElement.src = post.imageUrl;
    }

    const titleElement = liElement.querySelector('#postItemTitle');
    if (titleElement) {
      titleElement.innerText = post.title;
    }

    const desElement = liElement.querySelector('#postItemDescription');
    if (desElement) {
      desElement.innerText = utils.truncateTextlength(post.description, 50);
    }

    const postElement = liElement.querySelector('#goToDetailPageLink');
    if (postElement) {
      postElement.href = `post-detail.html?postId=${post.id}`;
    }

    const editPost = liElement.querySelector('#postItemEdit');
    if (editPost) {
      editPost.addEventListener('click', (e) => handleEditButton(e, post));
    }

    const removePost = liElement.querySelector('#postItemRemove');
    if (removePost) {
      removePost.addEventListener('click', () => handleRemovePost(liElement, post));
    }
  }
  return liElement;
}

// const getNewPostList = (postList) => {
//   const navLinkList = document.querySelector('#postsPagination');
//   if(navLinkList){
//     setLinkNavigation();
//   }
//   return newpostlist;
// }

// // ----- LEARNING ----

// const getPostList = () => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   return fetch('https://js-post-api.herokuapp.com/api/posts', options)
//     .then(response => {
//       // console.log(response);

//       if (response.status >= 200 && response.status < 300) {
//         // response.json().then(data => console.log(data));
//         return response.json();
//       }
//     });
// };

// // getPostList().then(data => console.log(data));

// // async function abc() {}

// const getPostListAsync = async () => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   const response = await fetch('https://js-post-api.herokuapp.com/api/posts', options)
//   if (response.status >= 200 && response.status < 300) {
//     // response.json().then(data => console.log(data));
//     const data = await response.json();
//     return data;
//   }
// };

// const getPostDetail = async (postId) => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   const url = `${AppConstants.API_URL}/posts/${postId}`;
//   const response = await fetch(url, options);
//   if (response.status >= 200 && response.status < 300) {
//     // response.json().then(data => console.log(data));
//     const data = await response.json();
//     return data;
//   }
// };

// const updatePost = async (post) => {
//   const options = {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(post),
//   };

//   const url = `${AppConstants.API_URL}/posts/${post.id}`;
//   const response = await fetch(url, options);
//   if (response.status >= 200 && response.status < 300) {
//     // response.json().then(data => console.log(data));
//     const data = await response.json();
//     return data;
//   }
// };
// ----- LEARNING END ----

// -----------------------
// MAIN LOGIC
// -----------------------

const removeAttrClass = (liPaginationList) => {
  for (const liElement of liPaginationList) {
    liElement.classList.remove('active');
  }
}

const activeCurPage = (liPaginationList, maxPage) => {
  const params = new URLSearchParams(window.location.search);
  const curPage = Number(params.get('_page'));
  if (curPage === 1 || !curPage) {
    liPaginationList[1].classList.add('active');
  } else if (curPage === maxPage) {
    if (curPage > 2) {
      liPaginationList[3].classList.add('active');
    } else {
      liPaginationList[2].classList.add('active');
    }
  }
  else {
    liPaginationList[2].classList.add('active');
  }
}

const setHrefNotCurPage = (aPaginationList, liPaginationList, objValidate) => {
  const page = 1;
  if (objValidate.maxPage > 0) {
    aPaginationList[1].href = `index.html?_page=${page}&_limit=6`;
    aPaginationList[1].removeAttribute('hidden');
    aPaginationList[1].innerText = page;
  }

  if (objValidate.maxPage > 1) {
    aPaginationList[2].href = `index.html?_page=${page + 1}&_limit=6`;
    aPaginationList[2].removeAttribute('hidden');
    aPaginationList[2].innerText = page + 1;
    aPaginationList[3].href = `index.html?_page=${page + 1}&_limit=6`;
    liPaginationList[4].classList.remove('disabled');
  }

  if (objValidate.maxPage > 2) {
    aPaginationList[3].href = `index.html?_page=${page + 2}&_limit=6`;
    aPaginationList[3].removeAttribute('hidden');
    aPaginationList[3].innerText = page + 2;
    aPaginationList[4].href = `index.html?_page=${page + 1}&_limit=6`;
    liPaginationList[4].classList.remove('disabled');
  }
}

const setHrefAtMaxPage = (aPaginationList, liPaginationList, objValidate) => {
  const page = objValidate.curPage;

  if (objValidate.maxPage > 1) {
    aPaginationList[2].href = `index.html?_page=${page}&_limit=6`;
    aPaginationList[2].removeAttribute('hidden');
    aPaginationList[2].innerText = page;
    aPaginationList[0].href = `index.html?_page=${page - 1}&_limit=6`;
    liPaginationList[0].classList.remove('disabled');
    liPaginationList[4].classList.add('disabled');
  }

  if (objValidate.maxPage > 2) {
    aPaginationList[3].href = `index.html?_page=${page}&_limit=6`;
    aPaginationList[3].removeAttribute('hidden');
    aPaginationList[3].innerText = page;
    //aPaginationList[4].href = `index.html?_page=${page + 1}&_limit=6`;

    aPaginationList[2].href = `index.html?_page=${page - 1}&_limit=6`;
    aPaginationList[2].removeAttribute('hidden');
    aPaginationList[2].innerText = page - 1;

    aPaginationList[1].href = `index.html?_page=${page - 2}&_limit=6`;
    aPaginationList[1].removeAttribute('hidden');
    aPaginationList[1].innerText = page - 2;

    aPaginationList[0].href = `index.html?_page=${page - 1}&_limit=6`;
    liPaginationList[0].classList.remove('disabled');
    liPaginationList[4].classList.add('disabled');
  }
};

const setHrefMidMaxPageAndCurPage = (aPaginationList, liPaginationList, objValidate) => {
  const page = objValidate.curPage;

  aPaginationList[3].href = `index.html?_page=${page + 1}&_limit=6`;
  aPaginationList[3].removeAttribute('hidden');
  aPaginationList[3].innerText = page + 1;
  //aPaginationList[4].href = `index.html?_page=${page + 1}&_limit=6`;

  aPaginationList[2].href = `index.html?_page=${page}&_limit=6`;
  aPaginationList[2].removeAttribute('hidden');
  aPaginationList[2].innerText = page;

  aPaginationList[1].href = `index.html?_page=${page - 1}&_limit=6`;
  aPaginationList[1].removeAttribute('hidden');
  aPaginationList[1].innerText = page - 1;

  aPaginationList[0].href = `index.html?_page=${page - 1}&_limit=6`;
  aPaginationList[4].href = `index.html?_page=${page + 1}&_limit=6`;

  liPaginationList[0].classList.remove('disabled');
  liPaginationList[4].classList.remove('disabled');
}

const unHidePagination = () => {
  const paginationElement = document.querySelector('#postsPagination');
  paginationElement.removeAttribute('hidden');
}

const renderPagination = async (maxPage) => {
  try {
    let newPostList = null;
    const params = new URLSearchParams(window.location.search);
    const curPage = Number(params.get('_page'));
    const aPaginationList = document.querySelectorAll('a.page-link');
    const liPaginationList = document.querySelectorAll('li.page-item');
    const objValidate = {
      curPage: curPage,
      maxPage: maxPage,
    };

    if (maxPage < 1) return;
    else {
      if (!curPage || curPage === 1) {
        removeAttrClass(liPaginationList);
        setHrefNotCurPage(aPaginationList, liPaginationList, objValidate);
        newPostList = (await postApi.getAll({ _page: 1, _limit: 6 })).data;
        unHidePagination();
        activeCurPage(liPaginationList, maxPage);
      }
      else if (curPage === maxPage) {
        removeAttrClass(liPaginationList);
        setHrefAtMaxPage(aPaginationList, liPaginationList, objValidate);
        const params = new URLSearchParams(window.location.search);
        const page = Number(params.get('_page'));
        newPostList = (await postApi.getAll({ _page: page, _limit: 6 })).data;
        unHidePagination();
        activeCurPage(liPaginationList, maxPage);
      }
      else {
        removeAttrClass(liPaginationList);
        setHrefMidMaxPageAndCurPage(aPaginationList, liPaginationList, objValidate);
        const params = new URLSearchParams(window.location.search);
        const page = Number(params.get('_page'));
        newPostList = (await postApi.getAll({ _page: page, _limit: 6 })).data;
        unHidePagination();
        activeCurPage(liPaginationList, maxPage);
      }
    }
    return newPostList;
  } catch (error) {
    throw error;
  }
};


const init = async () => {
  try {
    const postList = await postApi.getAll({ _page: '', _limit: '' });
    const maxPage = Math.ceil(postList.length / 6);
    const newPostList = await renderPagination(maxPage);

    const ulPostList = utils.getElementById('postsList');
    if (ulPostList) {
      for (const post of newPostList) {
        const liElement = buildLiElement(post);
        ulPostList.appendChild(liElement);
      }
    }
  } catch (error) {
    console.log(error);
  }

  // postApi.getAll()
  //   .then(postList => console.log(postList))
  //   .catch(error => console.log('Failed to fetch post list: ', error));

  // try {
  //   const post = await postApi.getDetail('1356b24a-8b63-41dc-9bbe-1bfd5f4a219a');
  //   console.log('Post: ', post);
  // } catch (error) {
  //   console.log('Failed to fetch post: ', error);
  // }
};

init();
