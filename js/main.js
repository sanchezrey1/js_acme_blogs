/*
1. createElemWithText
*/
function createElemWithText(element = "p", textContent = "", className = "") {
	const elem = document.createElement(element);
	elem.textContent = textContent;
	if (className) elem.className = className;
	return elem;
}
/*
2. createSelectOptions
*/
function createSelectOptions(users) {
  if (!users) return;
  const options = [];
  for (const user of users) {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  }
  return options;
}
/*
3. toggleCommentSection
*/
function toggleCommentSection(postId) {
  if (!postId) return;
  const section = document.querySelector(`section[data-post-id="${postId}"]`);
  if (section) {section.classList.toggle('hide');}
  return section;
}
/*
4. toggleCommentButton
*/
function toggleCommentButton (postId) {
    if (!postId) return;
    const button = document.querySelector(`button[data-post-id = "${postId}"]`);
    if (button) {button.textContent = button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
    }
    return button;
}
/*
5. deleteChildElements
*/
function deleteChildElements(parentElement) {
  if(!parentElement || !(parentElement instanceof HTMLElement)) {return undefined;}
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}
/*
6. addButtonListeners
*/
function addButtonListeners () {
    const mainElem = document.querySelector('main')
    const buttons = mainElem.querySelectorAll('button')
    if(buttons){
      for(let i = 0; i < buttons.length; i++){
        let buttonElem = buttons[i]
        let postId = buttonElem.dataset.postId
        buttonElem.addEventListener('click', function(event){
          toggleComments(event, postId), false})
      }
      return buttons
    }
}
/*
7. removeButtonListeners
*/
function removeButtonListeners () {
    const mainElem = document.querySelector('main')
    const buttons = mainElem.querySelectorAll('button')
    console.log(buttons)
    if(buttons){
      for(let i = 0; i < buttons.length; i++){
        let buttonElem = buttons[i]
        let postId = buttonElem.dataset.postId
        buttonElem.removeEventListener('click', function(event){ 
          toggleComments(event, postId), false})
      }
      return buttons
    }
}
/*
8. createComments
*/
function createComments(comments) {
    if (!comments) return;
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const body = createElemWithText("p", comment.body);
        const email = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3, body, email);
        fragment.appendChild(article);});
    return fragment;
}
/*
}9. populateSelectMenu
*/
  function populateSelectMenu(users) {
      if (!users) return;
      let selectMenu = document.querySelector("#selectMenu");
      let options = createSelectOptions(users);
      for (let i = 0; i < options.length; i++) {
      let option = options[i];
      selectMenu.append(option);
    }
  return selectMenu;
}
/*
10. getUsers
*/
async function getUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(error);
  }
}
/*
11. getUserPosts
*/
async function getUserPosts(id) {
  if(!id) {return undefined;
  }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
    const idData = await response.json();
    return idData;
  } catch (error) {
    console.error(error);
  }
}
/*
12. getUser
*/
async function getUser(id) {
  if(!id) {return undefined;
  }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
/*
13. getPostComments
*/
async function getPostComments(postId) {
  if(!postId) {return undefined;
  }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post comments');
    }
    const commentsData = await response.json();
    return commentsData;
  } catch (error) {
    console.error('Error fetching post comments:', error);
    throw error;
  }
}
/*
14. displayComments
*/
async function displayComments(postId) {
  if(!postId) {return undefined;
  }
  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments", "hide");
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  section.append(fragment);
  console.log(section);
  return section;
}
/*
15. createPosts
*/
async function createPosts(posts) {
  if(!posts) {return undefined;
  }
  const fragment = document.createDocumentFragment();  
  for (const post of posts) {                        
    const article = document.createElement('article');  
    const h2 = createElemWithText('h2', post.title);  
    const p1 = createElemWithText('p', post.body);  
    const p2 = createElemWithText('p', `Post ID: ${post.id}`);  
    const author = await getUser(post.userId) || {};   
    const p3 = createElemWithText('p', `Author: ${author.name || "Unknown"} with ${author.company?.name || "Unknown Company"}`); 
    const p4 = createElemWithText('p', `${author.company?.catchPhrase || ""}`);  
    const button = createElemWithText('button', 'Show Comments');  
    button.dataset.postId = post.id;     
    article.append(h2, p1, p2, p3, p4, button);
    const section = await displayComments(post.id); 
    article.append(section); 
    fragment.append(article); 
  }
  return fragment;
} 
/*
16. displayPosts
*/
async function displayPosts(posts) {
  const main = document.querySelector("main");
  const element = (await createPosts(posts)) ? await createPosts(posts) : createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');
  main.append(element);
  return element;
}
/*
17. toggleComments
*/
function toggleComments(event, postId){
  if (!event || !postId){return undefined;
  }
  event.target.listener = true;
  const section  = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  return [section, button];
}
/*
18. refreshPosts
*/
async function refreshPosts(posts) {
  if (!posts) {return undefined;
  }
  const removeButtons = removeButtonListeners();
  const main = deleteChildElements(document.querySelector("main"));
  const fragment = await displayPosts(posts);
  const addButtons = addButtonListeners();
  return [removeButtons, main, fragment, addButtons];
}
/*
19. selectMenuChangeEventHandler
*/
async function selectMenuChangeEventHandler(event) { 
    if(!event) {return undefined;
    }
    document.getElementById("selectMenu").disabled = true;
    const userId = event?.target?.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    document.getElementById("selectMenu").disabled = false;
    return [userId, posts, refreshPostsArray];
    }
/*
20. initPage
*/
async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
}
/*
21. initApp
*/
function initApp(){
  initPage();
  const select = document.getElementById("selectMenu");
  select.addEventListener("change", selectMenuChangeEventHandler, false);
}

document.addEventListener("DOMContentLoaded", initApp, false);