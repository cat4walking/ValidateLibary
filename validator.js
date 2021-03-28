let validator = (options) => {
    // hàm thực hiện validate
    let validate = (inputElement, rule) => {
            let errorMessage = rule.test(inputElement.value);
            let errorElement = inputElement.parentElement.querySelector('.form-message');
            if (errorMessage) {
                errorElement.innerText = errorMessage;
                inputElement.parentElement.classList.add('invalid');
            } else {
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }
        }
        // lấy Element của form cần validate
    let formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach(rule => {
            let inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                }
            };
            // xử lý mỗi khi người dùng nhập
            inputElement.oninput = () => {
                let errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }
        });
    }

};

// định nghĩa rules
// nguyen tac rule
// 1 khi co loi => tra ra message loi
// 2 khi khong co loi => khong tra ra gi ca (undefined)
validator.isRequired = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    };
};

validator.isEmail = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập Email này';
        }
    };
};

validator.minLengthPassword = (selector, min) => {
    return {
        selector: selector,
        test: (value) => {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };
};