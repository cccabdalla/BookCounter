 -- Tap-1 : Adding meal types
create table mealtypes(
mealtypeid number(38) not null,
description varchar2(50) not null
);
/
INSERT ALL  
  INTO mealtypes (mealtypeid, description) VALUES (1, 'Breakfast')  
  INTO mealtypes(mealtypeid, description) VALUES (2, 'Lunch')  
  INTO mealtypes (mealtypeid, description) VALUES (3, 'Afternoon tea')  
  INTO mealtypes (mealtypeid, description) VALUES (4, 'Dinner')
SELECT * FROM dual;
/
create or replace procedure sp_meal_getmealtypes
(
    dataSource out sys_refcursor 
)
as 
begin
open dataSource for
select mealtypeid,description from mealtypes;
end;
/
