const apiUrl = "https://2023-engineer-camp.zeabur.app/api/v1/works";

// 資料畫面
const application_card_list = document.querySelector(".application_card_list");
// 分頁
const pagination = document.querySelector(".pagination");

// 分類
const application_select_item = document.querySelectorAll(
    ".application_select_item"
);

const select_filter_listTwo = document.querySelectorAll('.select_filter_listTwo')

let applicationData = [];
let pagesData = {};

const changeState = {
    type: "",
    sort: 0,
    page: 1,
    search: "",
};

// 1.先取得遠端資料 -> 2.再渲染資料/頁數到畫面上 -> 3.

const getApiData = ({ type, sort, page, search }) => {
    const apiUrlNew = `${apiUrl}?sort=${sort}&page=${page}&${type ? `type=${type}&` : ""
        }${search ? `search=${search}` : ""}`;
    axios
        .get(apiUrlNew)
        .then((res) => {
            applicationData = res.data.ai_works.data;
            pagesData = res.data.ai_works.page;
            // 2. 資料
            renderData();
            // 2. 頁數
            renderPage();
        })
        .catch((err) => {
            alert(err);
        });
};
// 1.
getApiData(changeState);

// 2.
const renderData = () => {
    let application_info = "";

    if (applicationData.length === 0) {
        application_card_list.innerHTML = `<p class="noData">目前無資料，請重新查詢<p>`;
        return;
    }

    applicationData.forEach((item) => {
        application_info += `                        
    <li class="application_card_item">
        <a href="${item.link}" class="application_card_link">
            <div class="application_card_img">
                <img src="${item.imageUrl}" alt="image">
            </div>
            <div class="application_card_info grow">
                <h2 class="title">${item.title}</h2>
                <h3 class="text">${item.description}</h3>
            </div>
            <div class="application_card_info application_card_class">
                <p class="fw_bold">${item.model}</p>
                <p>${item.discordId}</p>
            </div>
            <div class="application_card_info application_card_category">
                <p class="fw_bold">${item.type}</p>
                <span class="material-symbols-outlined">share</span>
            </div>
        </a>
    </li>`;
    });
    application_card_list.innerHTML = application_info;
};

// 2.狀態 - 頁碼

const renderPage = () => {
    let pageStr = "";

    pageStr += `<li class="page_item">
                    <a href="#" class="page_link ${pagesData.has_pre == false ? 'disabled' : ''}" data-page="Previous">
                        <span class="material-symbols-outlined"> chevron_left </span>
                    </a>
                </li>`

    for (let i = 1; i <= pagesData.total_pages; i += 1) {
        pageStr += `<li class="page_item">
                        <a href="#" class="page_link ${pagesData.current_page == i ? 'show disabled' : ''}" data-page="${i}">${i}</a>                </li>`
    };
    pageStr += `<li class="page_item">
                    <a href="#" class="page_link ${pagesData.has_next == false ? 'disabled' : ''}" data-page="Next">
                        <span class="material-symbols-outlined"> chevron_right </span>
                    </a>
                </li>`

    pagination.innerHTML = pageStr

    const page_links = document.querySelectorAll('.page_link')
    page_links.forEach((page_link) => {
        page_link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (page === 'Previous' && !page_link.classList.contains('disabled')) {
                changeState.page -= 1;
            } else if (page === 'Next' && !page_link.classList.contains('disabled')) {
                changeState.page += 1;
            } else {
                changeState.page = parseInt(page);
            }
            getApiData(changeState);
        });
    });
};

// 分類

[...application_select_item, ...select_filter_listTwo].forEach((item) => {
    item.addEventListener("click", (e) => {
        if (e.target.textContent === "全部") {
            changeState.type = "";
        } else {
            changeState.type = e.target.textContent;
        }
        getApiData(changeState);
        bgChange(changeState.type);
    });
});
const bgChange = (type) => {
    [...application_select_item].forEach((item) => {
        item.classList.remove("active");
    });

    const matchingItems = [...application_select_item].filter((item) => {
        if (type === "") {
            return item.textContent === "全部";
        } else {
            return item.textContent === type;
        }
    });
    matchingItems.forEach((item) => {
        item.classList.add("active");
    });
}

// 搜尋 
// 當搜尋欄按下 enter 後執行 輸入值=changeState.search 再傳入 getApiData(changeState)
const application_search = document.querySelector('.application_search')
application_search.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        changeState.search = application_search.value
        changeState.page = 1
        getApiData(changeState);
    }
})


// sort 排序
const sort_new_old = document.querySelector('.sort_new_old')
// 更換最上面的字
const application_select_label = document.querySelector('.application_select_label')

sort_new_old.addEventListener('click', (e) => {
    if (e.target.className === 'new') {
        changeState.sort = 0;
        application_select_label.innerHTML = `${e.target.innerHTML} <span class="material-symbols-outlined"> expand_more </span>`
    } else if (e.target.className === 'old') {
        changeState.sort = 1;
        application_select_label.innerHTML = `${e.target.innerHTML} <span class="material-symbols-outlined"> expand_more </span>`
    }
    getApiData(changeState);
})