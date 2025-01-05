# import asyncio


# async def main():
#     print(f"main started...")


# asyncio.run(main())

import asyncio


async def task1():
    await asyncio.sleep(5)
    print("Task 1 complete")


async def task2():
    await asyncio.sleep(5)
    print("Task 2 complete")


async def main():
    print("Start of main coroutine")
    await asyncio.gather(task1(), task2())
    print("end of main coroutine")

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
