import configs from "../configs";

const validation = import(`./${configs.app.locale}/validation`);
export default {
    validation
};