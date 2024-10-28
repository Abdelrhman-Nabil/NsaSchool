import FormContianer from "@/app/component/comp/formContianer";
import Pagination from "@/app/component/comp/Pagination";
import Table from "@/app/component/comp/Table";
import TableSearch from "@/app/component/comp/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import {Attendance, Lesson, Prisma, Student } from "@prisma/client";
import Image from "next/image";
type attendanceList=Attendance & {lesson:Lesson} &{student: Student }

 

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const {userId,sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currnetUserId=userId!;
  const renderRow = (item: attendanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.student.name + " " +item.student.surname}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell"> {new Intl.DateTimeFormat("en-US").format(item.date)}</td>
      <td className="hidden md:table-cell">{item.lesson.name}</td>
        <td className="hidden md:table-cell"> {item.present.toString()}</td>

      <td>
        <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
            <>
              <FormContianer table="attendance" type="update" data={item} />
              <FormContianer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  
  const columns = [
  {
    header: "Student Name",
    accessor: "student",
    className: "",
  
  },
  {
    header: "Date",
    accessor: "date",
    className: "",
  },
  
  {
    header: "Lesson",
    accessor: "lesson",
    className: "hidden lg:table-cell",
  },
  {
    header: "Present",
    accessor: "present",
    className: "lg:table-cell",
  },
  ...(role === "admin" || role === "teacher"
    ? [
      {
        header: "Actions",
        accessor: "action",
      },
    ]
    : []),
  ];
  
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.AttendanceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.studentId = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS

  // const roleConditions = {
  //   teacher: { lessons: { some: { teacherId: currnetUserId! } } },
  //   student: { students: { some: { id: currnetUserId! } } },
  //   parent: { students: { some: { parentId: currnetUserId! } } },
  // };



  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        lesson: true,
        student:true
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.attendance.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Attendance</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role ==="teacher") && (
              <FormContianer table="attendance" type="create"/>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination  page={p} count={count}/>
    </div>
  );
};

export default AttendanceListPage;