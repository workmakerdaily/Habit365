import CheckBoxOutline from '../../assets/icons/check_box_outline.png';
import CheckBox from '../../assets/icons/check_box.png';
import DeleteForever from '../../assets/icons/delete_forever.png';
import Edit from '../../assets/icons/edit.png';

const prefix = 
    'https://firebasestorage.googleapis.com/v0/b/habit365-43ac1.firebasestorage.app/o';

export const images = {
    logo: `${prefix}/logo.png?alt=media`,
    photo: `${prefix}/photo.png?alt=media`,
    uncompleted: CheckBoxOutline,
    completed: CheckBox,
    delete: DeleteForever,
    update: Edit,
};