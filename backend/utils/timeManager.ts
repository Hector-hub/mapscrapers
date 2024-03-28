export const  getMinutes = (timeString) => {
    let parts = timeString.split(' ');

    let minutes = 0;

    for (let i = 0; i < parts.length; i += 2) {
        let countMinutes = parseInt(parts[i]);
        let units = parts[i + 1]; 

        if (units.includes('h')) {
            minutes += countMinutes * 60;
        } else if (units.includes('min')) {
            minutes += countMinutes;
        }
    }

    return minutes;
}