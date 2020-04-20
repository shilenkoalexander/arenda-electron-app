import Chance from 'chance';
// import Period from '@/backend/utils/period';
// import { isFirstCalculation } from '@/backend/service/finance-service';

const chance = new Chance();

// jest.mock('better-sqlite3');
// jest.mock('better-sqlite3-helper');

// jest.mock('@/backend/repository/finance-repository');

test('should return true when contract start date in period', () => {
    const startDate = chance.date({ year: 2020, month: 4 });
    // const period = Period.ofMonthYear(2020, 4);
    const contractId = chance.integer();

    // const actual = isFirstCalculation(period, contractId);

    // console.log(actual);
});
