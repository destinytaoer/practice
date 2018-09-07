~ function () {
  let province = document.getElementById('province'),
    city = document.getElementById('city'),
    county = document.getElementById('county');

  let regionData = null;

  //=> fomateData: 通过等级来获取数据
  // level: 0, value 不传 -> 获取所有的省名
  // level: 1, value: 省名 -> 获取该省的所有市名
  // level: 2, value: 市名 -> 获取该市的所有区名
  function fomateData(level, value) {
    let result = [],
      data = null;

    if (level === 0) {
      regionData.forEach(item => {
        result.push(item.name);
      });
    }

    if (level === 1) {
      regionData.filter(item => {
        if (item.name === value) {
          data = item;
          return false;
        }
      });

      if (data) {
        data['city'].forEach(item => {
          result.push(item.name);
        });
      }
    }

    if (level === 2) {
      regionData.filter(item => {
        item['city'].filter(item => {
          if (item.name === value) {
            data = item;
            return false;
          }
        });
        return false;
      });

      if (data) {
        data['area'].forEach(item => {
          result.push(item);
        })
      }
    }

    return result;
  }

  //=> bindData: 通过传入的数据，得到绑定 option 后的 HTML 字符串
  function bindData(data) {
    let str = '';
    data.forEach(item => {
      str += `'<option value="${item}">${item}</option>`
    });
    return str;
  }

  //=> clear: 清空下拉框
  // falg: 0 -> 清除省
  // falg: 1 -> 清除市
  // falg: 2 -> 清除区
  // falg: 不传 -> 清除省、市、区
  function clear(flag) {
    let clearStr = '<option value="">==请选择==</option>';

    switch (flag) {
      case 0:
        province.innerHTML = clearStr;
        break;
      case 1:
        city.innerHTML = clearStr;
        break;
      case 2:
        county.innerHTML = clearStr;
        break;
      default:
        province.innerHTML = clearStr;
        city.innerHTML = clearStr;
        county.innerHTML = clearStr;
    }
  }

  let xhr = new XMLHttpRequest();

  xhr.open('get', './regionData.json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && /^2\d{2}|304$/.test(xhr.status)) {
      regionData = JSON.parse(xhr.responseText);
      let data = fomateData(0);
      province.innerHTML += bindData(data);

      province.onchange = function () {
        clear(1);
        clear(2);
        let value = this.value,
          data = fomateData(1, value);
        city.innerHTML += bindData(data);
        //=> 设置默认值为第一个
        // city.innerHTML = bindData(data);
        // county.innerHTML = bindData(fomateData(2, data[0]));
      }

      city.onchange = function () {
        clear(2);
        let value = this.value,
          data = fomateData(2, value);
        county.innerHTML += bindData(data);
        // county.innerHTML = bindData(data);
      }

      county.onchange = function () {
        console.log(province.value, city.value, county.value);
      }
    }
  }
  xhr.send();
}()