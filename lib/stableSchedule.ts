// This file contains a curated word schedule. The schedule is base64 encoded
// to prevent users from easily spoiling future words.

const encodedSchedule = "ewoiMjAyNC0wOC0wMSI6eyI0Ijoi0KHQsNCx0LQiLCI1Ijoi0KHQsNCx0LDRiCIsIjYiOiLQodCw0LHQsNC70LAifSwiMjAyNC0wOC0wMiI6eyI0Ijoi0KLQkNCzIiwiNSI6ItCi0JDQsyIsIjYiOiLQotCQ0LPRgyJ9LCIyMDI0LTA4LTAzIjp7IjQiOiLQkNCw0LvQsCIsIjUiOiLQkNCw0LvQsNGEIiwiNiI6ItCQ0LDQu9Cw0LsgIn0sIjIwMjQtMDgtMDQiOnsiNCI6ItCe0JjQkCIsIjUiOiLQntCY0LDRgSIsIjYiOiLQntCY0LPRgyJ9LCIyMDI0LTA4LTA1Ijp7IjQiOiLQqNCw0LvQsCIsIjUiOiLQqNCw0LvQsyIsIjYiOiLQqNCw0LvQsNGLIn0sIjIwMjQtMDgtMDYiOnsiNCI6ItCQ0LvQsNCwIiwiNSI6ItCQ0LvQsNCw0YQiLCI2Ijoi0JDQu9Cw0LDRgyJ9LCIyMDI0LTA4LTA3Ijp7IjQiOiLQkNCd0LDRgSIsIjUiOiLQkNCd0LPRgyIsIjYiOiLQkNCd0LPRgyJ9LCIyMDI0LTA4LTA4Ijp7IjQiOiLQkNCi0LDRgSIsIjUiOiLQkNCi0LPRgyIsIjYiOiLQkNCi0LPRgyJ9LCIyMDI0LTA4LTA5Ijp7IjQiOiLQmtCy0JjQkCIsIjUiOiLQmtCy0JjRgiIsIjYiOiLQmtCy0JjQtdC80LUifSwiMjAyNC0wOC0xMCI6eyI0Ijoi0JbQsNCj0LQiLCI1Ijoi0JbQsNCj0LHRgiIsIjYiOiLQl9Cw0LjRgdC00LAsIn0sIjIwMjQtMDgtMTEiOnsiNCI6ItCi0LXRgNGAIiwiNSI6ItCi0LXRgNC8IiwiNiI6ItCi0LXRgNC80LfRgyJ9LCIyMDI0LTA4LTEyIjp7IjQiOiLQl9C10LzRkCIsIjUiOiLQl9C10LzRkNCyIiwiNiI6ItCX0LXQvNGQ0YLRgyJ9LCIyMDI0LTA4LTEzIjp7IjQiOiLQmtC40LvRgiIsIjUiOiLQmtC40YLQsNC/IiwiNiI6ItCa0LjRgtCQ0LHQuSJ9LCIyMDI0LTA4LTE0Ijp7IjQiOiLQkdC40LvRgCIsIjUiOiLQkdC40LvRkCIsIjYiOiLQkdC40LvRkNC30YMiLCIyMDI0LTA4LTE1Ijp7IjQiOiLQntRgNCw0LsiLCI1Ijoi0J7RgdC40LPRgyIsIjYiOiLQntGB0LjRgdC40YgifSwiMjAyNC0wOC0xNiI6eyI0Ijoi0JbRgNCx0LQiLCI1Ijoi0JbRgNC80YHRiyIsIjYiOiLQl9GB0LzQsNGB0YjRgyJ9LCIyMDI0LTA4LTE3Ijp7IjQiOiLQidCe0KHQgiIsIjUiOiLQidCe0KHQsdC4IiwiNiI6ItCR0J7QodCx0YgifSwiMjAyNC0wOC0xOCI6eyI0Ijoi0KLRgNCx0YMiLCI1Ijoi0KLRgNCx0YHRgSIsIjYiOiLQotGA0LHRgdC40YHRiyJ9LCIyMDI0LTA4LTE5Ijp7IjQiOiLQkNCw0YHRgCIsIjUiOiLQkNCw0YHRgdGAIiwiNiI6ItCQ0LDRgdGA0LPRgNCyIn0sIjIwMjQtMDgtMjAiOnsiNCI6ItCa0JjQvdC1IiwiNSI6ItCa0JjQvdC40LsiLCI2Ijoi0JrQmNC90LjRgdC70LDRgyJ9LCIyMDI0LTA4LTIxIjp7IjQiOiLQl9Cy0YDQkCIsIjUiOiLQl9Cy0YDQk9CaIiwiNiI6ItCX0LLRgNCT0JbQuiJ9LCIyMDI0LTA4LTIyIjp7IjQiOiLQkNCy0LzQsCIsIjUiOiLQkNCy0LzQsNGC0LQiLCI2Ijoi0JDQs9C80LDRgdC70YMiLCIyMDI0LTA4LTIzIjp7IjQiOiLQnNCw0LHRgiIsIjUiOiLQnNCw0LHRgdGA0KIiLCI2Ijoi0JzQsNCx0YHRgNCi0LgifSwiMjAyNC0wOC0yNCI6eyI0Ijoi0KHQtdGA0YAiLCI1Ijoi0KHQtdGA0LwiLCI2Ijoi0KHQtdGA0LzQt9GDIn0sIjIwMjQtMDgtMjUiOnsiNCI6IsKg0LzRltGCiIsIjUiOiLCoNC80ZbRgtC4IiwiNiI6ItCo0LzRltCa0LXRgCJ9LCIyMDI0LTA4LTI2Ijp7IjQiOiLRgdCy0LDRgCIsIjUiOiLRgdCy0LDRgdGAIiwiNiI6ItGD0LDQvdCy0LDQoSJ9LCIyMDI0LTA4LTI3Ijp7IjQiOiLQkdC10YDQkCIsIjUiOiLQkdC10YDQk9CaIiwiNiI6ItCR0LXRgNCT0JrQtdC70LDRgyJ9LCIyMDI0LTA4LTI4Ijp7IjQiOiLQkdC40YHRgCIsIjUiOiLQkdC40YDRgdC40LoiLCI2Ijoi0JHQuNGA0YHRgtC40YLQkSJ9LCIyMDI0LTA4LTI5Ijp7IjQiOiLQotCw0YLRgCIsIjUiOiLQotCw0YLRgNGLIiwiNiI6ItCi0LDRgtGB0LjRgyJ9LCIyMDI0LTA4LTMwIjp7IjQiOiLQkdC10JjQuNC8IiwiNSI6ItCR0LXQkdC40YDRgiIsIjYiOiLQkdC10JHQmNGB0YLRgtC40LsiLCIyMDI0LTA4LTMxIjp7IjQiOiLQotCg0LLQtdGAIiwiNSI6ItCI0LDRgNC10LsiLCI2Ijoi0KLQoNCy0LXRgdGLIn0sIjIwMjQtMDktMDEiOnsiNCI6ItCQ0YPQu9C60LgiLCI1Ijoi0JHQmNC00LDQudGDIiwiNiI6ItCU0LLQsNC90LgifSwiMjAyNC0wOS0wMiI6eyI0Ijoi0JHQutCw0YLQsNGAIiwiNSI6ItCW0LDRkdC70LDQsNGLIiwiNiI6ItCU0LLQsNC80LDQsNGLIn0sIjIwMjQtMDktMDMiOnsiNCI6ItCQ0LvRgdC10LAiLCI1Ijoi0JDQv9Cw0YHQstCyIiwiNiI6ItCQ0L/QsNGA0YsiIn0sIjIwMjQtMDktMDQiOnsiNCI6ItCh0LDRgNCyIiwiNSI6ItCQ0L/QsNGB0YDQsiIsIjYiOiLQkNC/0LDRgNGLIn0sIjIwMjQtMDktMDUiOnsiNCI6ItCT0LzQsNCyIiwiNSI6ItCQ0L/Qs9Cw0LDRgyIsIjYiOiLQkNC70LDRgNGLIn0sIjIwMjQtMDktMDYiOnsiNCI6ItCT0LzQvdCwIiwiNSI6ItCQ0LvQsNGC0LDRgNCyIiwiNiI6ItCQ0YPQutGLIn0sIjIwMjQtMDktMDciOnsiNCI6ItCW0LDQkdC4IiwiNSI6ItCQ0YDRi9C70LDRgyIsIjYiOiLQodCw0L/QutC4In0sIjIwMjQtMDktMDgiOnsiNCI6ItCQ0L/QsNCwIiwiNSI6ItCh0LDQv9Cw0LDRgyIsIjYiOiLQodCw0LDRgNCw0LMiLCIyMDI0LTA5LTA5Ijp7IjQiOiLQkNC/0LPQsCIsIjUiOiLQodCw0YDRhNGA0LIiLCI2Ijoi0JbQtNC10YDRgdGB0YAifSwiMjAyNC0wOS0xMCI6eyI0Ijoi0JDQu9Cw0YLQsNGAIiwiNSI6ItCW0LXRgNGD0YHQuCIsIjYiOiLQltC00LXRgNGB0YHQstGLIn0sIjIwMjQtMDktMTEiOnsiNCI6ItCQ0YPQi9C70LAiLCI1Ijoi0JbQtNC10YDRgdGDIiwiNiI6ItCQ0L3QsNGA0LDQs9GDIn0sIjIwMjQtMDktMTIiOnsiNCI6ItCh0LDQv9CwIiwiNSI6ItCQ0L3QsNCz0LDQuyIsIjYiOiLQkNC90LDQs9GA0LDQs9GDIn0sIjIwMjQtMDktMTMiOnsiNCI6ItCh0LDRgNCEIiwiNSI6ItCQ0L3QsNCw0LDRgdGDIiwiNiI6ItCQ0L3QsNGB0LDQs9GDIn0sIjIwMjQtMDktMTQiOnsiNCI6ItCW0JHQndCYIiwiNSI6ItCQ0LDRgNC60LgiLCI2Ijoi0JDQsNGA0LDQs9GDIn0sIjIwMjQtMDktMTUiOnsiNCI6ItCW0LDRkdC4IiwiNSI6ItCQ0LzQsNC/0LDQsNGLIiwiNiI6ItCQ0LzQsNC/0LDRgNCy0LgifSwiMjAyNC0wOS0xNiI6eyI0Ijoi0JbQsNC00JAiLCI1Ijoi0JDQvNCw0L/QsNC7IiwiNiI6ItCQ0LzQsNC/0LDQt9GDIn0sIjIwMjQtMDktMTciOnsiNCI6ItCW0LDQhtCCiIsIjUiOiLQkNC80LDQv9Cw0LPQgyIsIjYiOiLQkNC80LDQv9Cw0LPRgdC7In0sIjIwMjQtMDktMTgiOnsiNCI6ItCW0LDQtNGAIiwiNSI6ItCQ0LDRgdCw0YHRgyIsIjYiOiLQkNCw0YHQsdC+0LnRgyJ9LCIyMDI0LTA5LTE5Ijp7IjQiOiLQltCw0YbQptCiIiwiNSI6ItCQ0LDRgdC00LDQutC4IiwiNiI6ItCQ0LDRgdC00LDQutC4In0sIjIwMjQtMDktMjAiOnsiNCI6ItCW0LHQsdCaIiwiNSI6ItCh0YDRltCw0YDRgyIsIjYiOiLQodGA0ZbQsNCw0LPRgyJ9LCIyMDI0LTA5LTIxIjp7IjQiOiLQltCx0LHQsiIsIjUiOiLQodGA0ZbQsNC60LDRgyIsIjYiOiLQodGA0ZbQsNC60YDQsiJ9LCIyMDI0LTA5LTIyIjp7IjQiOiLQltCx0LHQvSIsIjUiOiLQodGA0LPQtdC40LDRgyIsIjYiOiLQodGA0LPQtdC40LDRgNCyIn0sIjIwMjQtMDktMjMiOnsiNCI6ItCW0LHQsdCyIiwiNSI6ItCQ0YHRgdC40LDRgyIsIjYiOiLQkNCw0YHRgtC40YHRgyJ9LCIyMDI0LTA5LTI0Ijp7IjQiOiLQltCx0LHRgtCiIiwiNSI6ItCQ0LjQvdC40LDQsNGLIiwiNiI6ItCQ0LjQvdC40LDRgdGLIn0sIjIwMjQtMDktMjUiOnsiNCI6ItCh0YDRltCiIiwiNSI6ItCQ0L3QuNCw0LDQsiIsIjYiOiLQkNC90LjQsNGA0YHRiyJ9LCIyMDI0LTA5LTI2Ijp7IjQiOiLQodGA0ZbQuCIsIjUiOiLQkNC70LDRgtCw0LDQsiIsIjYiOiLQkNC70LDRgtCw0YHRgSJ9LCIyMDI0LTA5LTI3Ijp7IjQiOiLQodGA0LPRkCIsIjUiOiLQkdCw0LHQkNCw0LDRgyIsIjYiOiLQkdCw0LHQkNCw0YHRgyJ9LCIyMDI0LTA5LTI4Ijp7IjQiOiLQkNGD0YHQsiIsIjUiOiLQkdCw0LHQvdCw0LDRgyIsIjYiOiLQkdCw0LHQvdGB0LsiLCIyMDI0LTA5LTI5Ijp7IjQiOiLQkNC40L3RgyIsIjUiOiLQkdC40L3QsNCw0YsiLCI2Ijoi0JHQuNC90L7RgdGDIn0sIjIwMjQtMDktMzAiOnsiNCI6ItCQ0L3QsNCwIiwiNSI6ItCQ0YPQu9C60LDQsNGLIiwiNiI6ItCQ0YPQu9C60YHQuyJ9LCIyMDI0LTEwLTAxIjp7IjQiOiLQkNC70LDRgtCwIiwiNSI6ItCQ0YPQvNCw0YDQstGDLCI2Ijoi0JDRg9C80LDRgNC/0YsiIn0sIjIwMjQtMTAtMDIiOnsiNCI6ItCR0LDQsdCQIiwiNSI6ItCQ0YPQsiIsIjYiOiLQkNGD0LLQsNC60LjQuyJ9LCIyMDI0LTEwLTAzIjp7IjQiOiLQkdC40LPQsNCwIiwiNSI6ItCQ0YPQutC40LDQstGDLCI2Ijoi0JDRg9C10LjQutC4In0sIjIwMjQtMTAtMDQiOnsiNCI6ItCR0LjQvdGDLCI1Ijoi0JDRg9Cx0LDQsNGLIiwiNiI6ItCQ0YPQsdCw0YDQsiJ9LCIyMDI0LTEwLTA1Ijp7IjQiOiLQkNGD0LvQuiIsIjUiOiLQkNGD0LHRgNCy0LgiLCI2Ijoi0JDRg9Cx0YDRgdC40LDRgyJ9LCIyMDI0LTEwLTA2Ijp7IjQiOiLQkNGD0LzRgCIsIjUiOiLQkNGD0LHQs9C4IiwiNiI6ItCQ0YPQsdCz0YDQsiJ9LCIyMDI0LTEwLTA3Ijp7IjQiOiLQkNGD0LLQsCIsIjUiOiLQkNGD0LDQudC40YDRgyIsIjYiOiLQkNGD0LDQudC40YPRgyJ9LCIyMDI0LTEwLTA4Ijp7IjQiOiLQkNGD0ZDQsCIsIjUiOiLQkNGD0LDQv9C40YDRgyIsIjYiOiLQkNGD0LDQv9C40YPRgyJ9LCIyMDI0LTEwLTA5Ijp7IjQiOiLQkNGD0ZDQuCIsIjUiOiLQkNGD0LvQsNCw0LDRgyIsIjYiOiLQkNGD0LvQsNCw0LDRgNC4In0sIjIwMjQtMTAtMTAiOnsiNCI6ItCQ0LHQsNCwIiwiNSI6ItCQ0YPQutCw0LDRgNC4IiwiNiI6ItCQ0YPQutCw0LDRgdC4In0sIjIwMjQtMTAtMTEiOnsiNCI6ItCQ0LHQsNCzIiwiNSI6ItCQ0YPQutC40LDQsNGLIiwiNiI6ItCQ0YPQutC40LDRgdC4In0sIjIwMjQtMTAtMTIiOnsiNCI6ItCQ0LHQsNC4IiwiNSI6ItCQ0YPQutGB0LDQsNGLIiwiNiI6ItCQ0YPQutGB0LDRgdC4In0sIjIwMjQtMTAtMTMiOnsiNCI6ItCQ0LHQsNC8IiwiNSI6ItCQ0YPQutGB0LjQsNGLIiwiNiI6ItCQ0YPQutGB0LjQsNGB0LgifSwiMjAyNC0xMC0xNCI6eyI0Ijoi0JDQsdCw0LsiLCI1Ijoi0JDRg9C60YHRg9GA0LgiLCI2Ijoi0JDRg9C60YHRg9GB0LgifSwiMjAyNC0xMC0xNSI6eyI0Ijoi0JDQt9Cx0LsiLCI1Ijoi0JDRg9C60LDQutGA0LgiLCI2Ijoi0JDRg9C60LDQutGB0LgifSwiMjAyNC0xMC0xNiI6eyI0Ijoi0JDQt9GB0LUiLCI1Ijoi0JDRg9C60LDQutCw0LDRgyIsIjYiOiLQkNGD0LrQsNC60LDRgdC4In0sIjIwMjQtMTAtMTciOnsiNCI6ItCR0LvQkNC9IiwiNSI6ItCQ0YPQutCw0LrRgdC4IiwiNiI6ItCQ0YPQutCw0LrRgdGB0LgifSwiMjAyNC0xMC0xOCI6eyI0Ijoi0JHQu9GB0LUiLCI1Ijoi0JDRg9C60LDQutCw0LDRgyIsIjYiOiLQkNGD0LrRgdC60LDRgdC4In0sIjIwMjQtMTAtMTkiOnsiNCI6ItCR0LvQs9CdIiwiNSI6ItCQ0YPQutGB0LjQutCw0LDRgyIsIjYiOiLQkNGD0LrRgdC40LrQsNGB0LgifSwiMjAyNC0xMC0yMCI6eyI0Ijoi0JDQu9Cz0J0iLCI1Ijoi0JDRg9C60YHRg9Cw0LDRgyIsIjYiOiLQkNGD0LrRgdGD0LDRgdC4In0sIjIwMjQtMTAtMjEiOnsiNCI6ItCT0LzRkNCyIiwiNSI6ItCQ0YPQutCw0LrQsNGA0LgiLCI2Ijoi0JDRg9C60LDQutCw0YHQsiJ9LCIyMDI0LTEwLTIyIjp7IjQiOiLQk9C80L3QtSIsIjUiOiLQkNGD0LrQsNC60YDRgdC4IiwiNiI6ItCQ0YPQutCw0LrRgdGB0LgifSwiMjAyNC0xMC0yMyI6eyI0Ijoi0JbQsdCQIiwiNSI6ItCQ0YPQutCw0LrQsNGB0LgiLCI2Ijoi0JDRg9C60LDQutGB0YHQsiJ9LCIyMDI0LTEwLTI0Ijp7IjQiOiLQkNC/0LHRgCIsIjUiOiLQkNGD0LrQutCw0YDRgdC4IiwiNiI6ItCQ0YPQutCw0LrRgdGB0LgifSwiMjAyNC0xMC0yNSI6eyI0Ijoi0JDQv9Cz0LAiLCI1Ijoi0JDRg9C60LrQsNGA0YHQsiIsIjYiOiLQkNGD0LrQutCw0YHRgdC4In0sIjIwMjQtMTAtMjYiOnsiNCI6ItCQ0LvQsNGC0LDRgCIsIjUiOiLQkNGD0LrQutGB0YDQsiIsIjYiOiLQkNGD0LrQutGB0YHQsiJ9LCIyMDI0LTEwLTI3Ijp7IjQiOiLQkNGD0YvQu9CwIiwiNSI6ItCQ0YPQutC60YHQutC4IiwiNiI6ItCQ0YPQutC60YHRgdC4In0sIjIwMjQtMTAtMjgiOnsiNCI6ItCh0LDQv9CwsCIsIjUiOiLQkNGD0LrQutGB0LrQsNGB0LgiLCI2Ijoi0JDRg9C60LrRgdC60YHQsiJ9LCIyMDI0LTEwLTI5Ijp7IjQiOiLQodCw0YDQhCIsIjUiOiLQkNGD0LrQutGB0YDQv9CyIiwiNiI6ItCQ0YPQutC60YDRv9GB0LgifSwiMjAyNC0xMC0zMCI6eyI0Ijoi0JbQkdCd0JgiLCI1Ijoi0JDRg9C60LrRgdGB0LIiLCI2Ijoi0JDRg9C60LrRgdGB0YHQsiJ9LCIyMDI0LTEwLTMxIjp7IjQiOiLQltCw0JHQuCIsIjUiOiLQkNGD0LrQutGB0YPQsiIsIjYiOiLQkNGD0LrQutGB0YPRgdCyIn19";

// Use a cache to avoid parsing the JSON on every call
let scheduleCache: Record<string, { 4: string; 5: string; 6: string; }> | null = null;

function b64DecodeUnicode(str: string) {
    try {
        const binaryString = atob(str.replace(/\s/g, ''));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    } catch(e) {
        console.error("Failed to decode base64 string", e);
        return "{}"; // return empty json object string
    }
}


function getSchedule(): Record<string, { 4: string; 5: string; 6: string; }> {
    if (scheduleCache) {
        return scheduleCache;
    }
    try {
        const decodedJson = b64DecodeUnicode(encodedSchedule);
        scheduleCache = JSON.parse(decodedJson);
        return scheduleCache!;
    } catch (e) {
        console.error("Could not decode or parse word schedule.", e);
        // Return an empty object on failure to avoid crashes
        return {};
    }
}

function dateYmdInAlmaty(d = new Date()): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Almaty",
        year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(d);
    const get = (t: string) => parts.find(p => p.type === t)!.value;
    return `${get("year")}-${get("month")}-${get("day")}`;
}

function daysBetween(aYmd: string, bYmd: string): number {
    const toUtcMs = (ymd: string) => {
        const [y, m, d] = ymd.split("-").map(Number);
        return Date.UTC(y, m - 1, d);
    };
    const A = toUtcMs(aYmd), B = toUtcMs(bYmd);
    return Math.floor((B - A) / 86400000);
}

// Epoch for game numbers and the curated schedule
const SCHEDULE_EPOCH = "2024-08-01";
const SEASON_NAME = "Season 2";

// --- Fallback logic ---
const JUAN = new Set(["а", "о", "ұ", "ы"]);
const JIN = new Set(["ә", "ө", "ү", "і", "е"]);
const BORROWED = new Set(["ф", "в", "х", "һ", "ч", "ц", "щ", "э", "ю", "я", "ё", "ь", "ъ"]);

function vowelsGroup(w: string): "juan" | "jin" | "mixed" | "none" {
    let j = 0, i = 0;
    for (const ch of w) {
        if (JUAN.has(ch)) j++;
        else if (JIN.has(ch)) i++;
    }
    if (!j && !i) return "none";
    if (j && i) return "mixed";
    return j ? "juan" : "jin";
}

function pickWordWithFallback(params: {
  answers: string[];
  length: 4 | 5 | 6;
  dayIndex: number;
}) {
    const { answers, length, dayIndex } = params;

    const base = answers
        .map(w => w.toLowerCase().trim())
        .filter(w => w.length === length)
        .filter(w => vowelsGroup(w) !== "mixed")
        .filter(w => ![...w].some(ch => BORROWED.has(ch)))
        .sort();
    
    let listToUse = base;
    if (base.length === 0) {
       const fallbackBase = answers.map(w => w.toLowerCase().trim()).filter(w => w.length === length);
       if (!fallbackBase.length) throw new Error(`CRITICAL: No words of length ${length} found.`);
       listToUse = fallbackBase;
    }
    
    const N = listToUse.length;
    const idx = ((dayIndex % N) + N) % N;
    return listToUse[idx];
}


export function pickWordOfDate(params: {
  answers: string[];
  length: 4 | 5 | 6;
}) {
    const { answers, length } = params;
    const dateYmd = dateYmdInAlmaty();
    const schedule = getSchedule();

    const dailyWords = schedule[dateYmd];
    const dayIndex = daysBetween(SCHEDULE_EPOCH, dateYmd);
    
    let word;

    if (dailyWords && dailyWords[length as keyof typeof dailyWords]) {
        word = dailyWords[length as keyof typeof dailyWords];
    } else {
        word = pickWordWithFallback({ answers, length, dayIndex });
    }

    return { 
        word: word.toUpperCase(), 
        idx: dayIndex,
        season: SEASON_NAME
    };
}

// Export schedule Base64 string for reuse (e.g., in alternative pickers)
export const SCHEDULE_B64: string = (encodedSchedule as unknown as string);
