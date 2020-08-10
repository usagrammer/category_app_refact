document.addEventListener('turbolinks:load', function () {

  const parentCategoryForm = document.querySelector('.category_select_form'); // 親カテゴリのフォーム

  if (!parentCategoryForm) return false // 親カテゴリのフォームが無いなら実行しない

  const categoryFormsWrapper = document.querySelector('#category-forms'); // カテゴリのフォームたちの親要素

  // 変更されたカテゴリのフォームより後ろにあるカテゴリのフォームを消すための関数
  const removeSiblings = (startElement, className) => { // startElementの後ろの要素のうち、classNameと一致する要素を全て削除する
    let nextElement = startElement.nextSibling;
    while (nextElement) {
      const checkElement = nextElement;
      nextElement = nextElement.nextSibling;
      if (checkElement.className == className) checkElement.remove();
    }
  }

  const categoryChanged = (e) => { // カテゴリが変更された時のイベント
    const selectedCategoryId = e.target.value; // 選択されたカテゴリのid
    const changedForm = e.target; // 選択されたカテゴリのフォーム

    if (!selectedCategoryId) { // 選択されたカテゴリのidが-----だった場合、後ろのフォームを消して終了
      removeSiblings(changedForm, "category_select_form");
      return false
    }

    // ajax準備
    const XHR = new XMLHttpRequest();
    XHR.open("GET", `api/categories/?category_id=${selectedCategoryId}`, true);
    XHR.responseType = "json";
    // ajax開始
    XHR.send();

    XHR.onload = () => {

      if (XHR.status != 200) { // ajaxに失敗した時の処理はこの中
        alert("failed");
        alert(`Error ${XHR.status}: ${XHR.statusText}`);
        return null;
      }

      const categories = XHR.response.categories; // コントローラから返ってきたカテゴリたち

      if (categories.length == 0) return false; // カテゴリたちが0個 = 孫カテゴリが選択されたので終了

      removeSiblings(changedForm, "category_select_form"); // 変更されたカテゴリのフォームより後ろにあるカテゴリのフォームを消す

      const newElement = document.createElement("div"); // addEventListnerのためにElementオブジェクトを作成
      newElement.innerHTML = buildSelectForm(categories); // Elementオブジェクトに新しいカテゴリのフォームを挿入
      const newSelectFormElement = newElement.childNodes[0]; // newElementの最初の子要素が新しいカテゴリのフォーム
      newSelectFormElement.addEventListener("change", categoryChanged); // 新しいカテゴリのフォームにイベントを追加
      categoryFormsWrapper.insertAdjacentElement("beforeend", newSelectFormElement); // 新しいカテゴリのフォームをビューに表示する
    }

  }

  const buildSelectForm = (categories) => { // 新しいカテゴリのフォームを組み立てる
    let options = "";
    categories.forEach(category => {
      options += buildOption(category);
    });
    let html = `<select class="category_select_form" name="category_id">
                  <option value="">-----</option>
                  ${options}
                </select>`;
    return html;
  }

  const buildOption = (category) => { // 新しいカテゴリのフォームのうちoptionタグ部分を組み立てる
    const html = `<option value="${category.id}">${category.name}</option>`;
    return html;
  }

  parentCategoryForm.onchange = categoryChanged;

});
