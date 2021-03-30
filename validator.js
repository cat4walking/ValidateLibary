let validator = (options) => {
    let selectorRules = {};
    // hàm thực hiện validate
    let validate = (inputElement, rule) => {
            let errorMessage;
            let errorElement = inputElement.parentElement.querySelector('.form-message');
            // lấy ra các rule của selector  
            let rules = selectorRules[rule.selector];
            // lặp qua từng rule
            for (let i = 0; i < rules.length; ++i) {
                errorMessage = rules[i](inputElement.value);
                if (errorMessage) break;
            };
            if (errorMessage) {
                errorElement.innerText = errorMessage;
                inputElement.parentElement.classList.add('invalid');
            } else {
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }

            return !errorMessage;
        }
        // lấy Element của form cần validate
    let formElement = document.querySelector(options.form);
    if (formElement) {
        formElement.onsubmit = (e) => {
            e.preventDefault();
            let isFormValid = true;
            // thực hiện lặp qua từng rule và validate
            options.rules.forEach(rule => {
                let inputElement = formElement.querySelector(rule.selector);
                let isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    let enableInput = formElement.querySelectorAll('[name]:not([disabled])');
                    let formValue = Array.from(enableInput).reduce((value, input) => {
                        return (value[input.name] = input.value) && value;
                    }, {});
                    options.onSubmit(formValue);
                } else {
                    formElement.onsubmit();
                }
            }
        }

        // xử lý lặp qua mỗi rule
        options.rules.forEach(rule => {
            // lưu lại rules
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

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
validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    };
};

validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập Email này';
        }
    };
};

validator.minLengthPassword = (selector, min, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };
};

validator.isConfirmed = (selector, getConfirm, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value === getConfirm() ? undefined : message || 'Giá trị truyền vào không chính xác';
        }
    }
}