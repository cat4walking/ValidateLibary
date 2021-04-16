let validator = (options) => {
    let getParent = (element, selector) => {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    let selectorRules = {};
    // hàm thực hiện validate
    let validate = (inputElement, rule) => {
            let errorMessage;
            let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
            // lấy ra các rule của selector  
            let rules = selectorRules[rule.selector];
            // lặp qua từng rule
            for (let i = 0; i < rules.length; ++i) {
                switch (inputElement.type) {
                    case 'checkbox':
                    case 'radio':
                        errorMessage = rules[i](
                            formElement.querySelector(rule.selector + ':checked')
                        );
                        break;
                    default:
                        errorMessage = rules[i](inputElement.value);
                }

                if (errorMessage) break;
            };
            if (errorMessage) {
                errorElement.innerText = errorMessage;
                getParent(inputElement, options.formGroupSelector).classList.add('invalid');
            } else {
                errorElement.innerText = '';
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
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
                    let enableInput = formElement.querySelectorAll('[name]');
                    let formValue = Array.from(enableInput).reduce((value, input) => {

                        switch (input.type) {
                            case 'radio':
                                if (input.matches(':checked'))
                                    value[input.name] = input.value
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                value[input.name] = '';
                        }
                        return value;
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

            let inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(inputElement => {
                inputElement.onblur = () => {
                        validate(inputElement, rule);
                    }
                    // xử lý mỗi khi người dùng nhập
                inputElement.oninput = () => {
                    let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            })
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
            return value ? undefined : message || 'Vui lòng nhập trường này'
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