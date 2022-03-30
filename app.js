//取得element
let submit = document.querySelector("button");
let content = submit.parentElement.children[0];
let month = submit.parentElement.children[1];
let date = submit.parentElement.children[2];

//在按下新增按紐時，將待辦事項等資訊加入待辦清單
submit.addEventListener("click", e => {
  //避免預設跳轉到指定網址
  e.preventDefault();

  //如果未填寫待辦事項，跳出警告視窗要求填寫
  if (content.value === "") {
    alert("pls enter some text");
    return;
  }

  //依照使用者填寫的資訊，建立事項、時間元素，把它們組合起來放進待辦清單
  let sec = document.querySelector("section");

  let todo = document.createElement("div");
  todo.classList.add("todo");

  let todoItem = document.createElement("p");
  todoItem.classList.add("todoContent");
  todoItem.innerText = content.value;

  let todoTime = document.createElement("p");
  todoTime.classList.add("todoTime");
  todoTime.innerText = month.value + "/" + date.value;

  let completeButton = document.createElement("button");
  completeButton.innerText = "完成";
  let deleteButton = document.createElement("button");
  deleteButton.innerText = "移除";

  sec.appendChild(todo);
  todo.appendChild(todoItem);
  todo.appendChild(todoTime);
  todo.appendChild(completeButton);
  todo.appendChild(deleteButton);

  //待辦清單的顯示動畫
  todo.style.animation = "scaleUp 0.3s forwards";

  //清空待辦事項填寫表單的「事項」欄位
  content.value = ""

  //如果就特定事項按下完成按紐，把該事項加上刪除線
  completeButton.addEventListener("click", e => {
    todo.classList.toggle("done");
  })

  //如果就特定事項按下刪除按紐，把該事項從待辦清單中移除，並從
  deleteButton.addEventListener("click", e => {
    //移除特定事項的動畫
    todo.style.animation = "scaleDown 0.3s forwards";

    //動畫完成後，移除此事項
    todo.addEventListener("animationend", () => {
      todo.remove();
    })

    let storeList = localStorage.getItem("list");
    let arrayList = JSON.parse(storeList);
    arrayList.forEach((item, index) => {
      if (item.content == todoItem.innerText && item.month + "/" + item.date == todoTime.innerText) {
        arrayList.splice(index, 1);
      }
    })
    if (arrayList.length !== 0) {
      localStorage.setItem("list", JSON.stringify(arrayList));
    } else {
      localStorage.removeItem("list");
    }
  })

  //store in localStorage
  let storeList = localStorage.getItem("list");
  if (storeList === null) {
    let todoObject = {
      content: todoItem.innerText,
      month: month.value,
      date: date.value,
    }
    let arrayList = JSON.stringify([todoObject]);
    localStorage.setItem("list", arrayList);
  } else {
    let arrayList = JSON.parse(storeList);
    let todoObject = {
      content: todoItem.innerText,
      month: month.value,
      date: date.value,
    }
    arrayList.push(todoObject);
    localStorage.setItem("list", JSON.stringify(arrayList));
  }
})

//show list stored in localStorage when open browser
showList();

//declare showList()
function showList() {
  let storeList = localStorage.getItem("list");
  if (storeList !== null) {
    let arrayList = JSON.parse(storeList);

    arrayList.forEach(item => {
      let sec = document.querySelector("section");
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let todoItem = document.createElement("p");
      todoItem.classList.add("todoContent");
      todoItem.innerText = item.content;
      let todoTime = document.createElement("p");
      todoTime.classList.add("todoTime");
      todoTime.innerText = item.month + "/" + item.date;

      todo.appendChild(todoItem);
      todo.appendChild(todoTime);
      sec.appendChild(todo);
      todo.style.animation = "scaleUp 0.3s forwards";

      let completeButton = document.createElement("button");
      let deleteButton = document.createElement("button");
      todo.appendChild(completeButton);
      todo.appendChild(deleteButton);

      completeButton.addEventListener("click", e => {
        todo.classList.toggle("done");
      })

      deleteButton.addEventListener("click", e => {
        todo.style.animation = "scaleDown 0.3s forwards";
        todo.addEventListener("animationend", () => {
          todo.remove();
        })
        arrayList.forEach((item, index) => {
          if (item.content == todoItem.innerText && item.month + "/" + item.date == todoTime.innerText) {
            arrayList.splice(index, 1);
          }
        })
        if (arrayList.length !== 0) {
          localStorage.setItem("list", JSON.stringify(arrayList));
        } else {
          localStorage.removeItem("list");
        }
      })
    })
  }
}

//sort by time
let sort = document.querySelector("button.sort");
sort.addEventListener("click", () => {
  storeList = localStorage.getItem("list");
  if (storeList !== null) {
    let arrayList = JSON.parse(storeList);
    let sortedArray = mergeSort(arrayList, 0, arrayList.length - 1);

    localStorage.setItem("list", JSON.stringify(sortedArray));

    let sec = document.querySelector("section");

    //sec.children.length不可當作for loop condition，因為它會在for loop執行過程中變動
    let len = sec.children.length
    for (let i = 0; i < len; i++) {
      sec.children[0].remove();
    }

    showList();
  } else {
    alert("nothing to sort");
  }
})


//merge sort (start sorting from index p to index q)
function mergeSort(arr, p, q) {
  let result = [];
  if (p < q) {
    let middle = Math.floor((p + q) / 2);
    let r1 = mergeSort(arr, p, middle);
    let r2 = mergeSort(arr, middle + 1, q);
    return merge(r1, r2);
  } else {
    result.push(arr[p]);
    return result;
  }
}

function merge(arr1, arr2) {
  let auxArray = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].month) < Number(arr2[j].month)) {
      auxArray.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].month) > Number(arr2[j].month)) {
      auxArray.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].month) == Number(arr2[j].month)) {
      if (Number(arr1[i].date) < Number(arr2[j].date)) {
        auxArray.push(arr1[i]);
        i++;
      } else {
        auxArray.push(arr2[j]);
        j++;
      }
    }
  }

  while (i < arr1.length) {
    auxArray.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    auxArray.push(arr2[j]);
    j++;
  }

  return auxArray;
}
