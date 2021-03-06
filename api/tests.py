from database import studentsDOM
from database import FormsDOM
from database import usersDOM
from database import parentsDOM
import subprocess
import datetime

# ---------------- PARENTS ------------------------
def testParentGetInfo(key, expected):
	actual = parentsDOM.getInfo(0, key)
	return expected == actual

def testParentGetForm():
	expected = ['010', '011']
	actual = parentsDOM.getParentForm(0, 1)
	return expected == actual

def testParentAddForm():
	expected = ['987']
	parentsDOM.addForm(3, 16, 987)
	actual = parentsDOM.getParentForm(3, 16)
	return expected == actual

def testParentRemoveForm():
	parentsDOM.removeForm(3, 16)
	return parentsDOM.getParentForm(3, 16) and False

def testListStudents():
	expected = ['0']
	actual = parentsDOM.listStudents(0, 0)
	return expected == actual

# ---------------- STUDENTS -----------------------
def testStudentGetInfo():
	expected = 'first0'
	actual = studentsDOM.getInfo(0, 'first_name')
	return expected == actual

def testStudentUpdateInfo():
	expected = 'newlast0'
	studentsDOM.updateInfo(0, 'last_name', 'newlast0')
	actual = studentsDOM.getInfo(0, 'last_name')
	return expected == actual

def testStudentGetForm():
	expected = ['320', '321']
	actual = studentsDOM.getForm(3, 0)
	return expected == actual

def testStudentAddForm():
	expected = ['987']
	studentsDOM.addForm(3, 16, 987)
	actual = studentsDOM.getForm(3, 16)
	return expected == actual

def testStudentCreateStudent():
	expected = 'newfirst'
	newBasicInfo = {
        		'first_name': 'newfirst',
        		'middle_name': 'newmiddle',
        		'last_name': 'newlast',
        		'DOB': '99-99-9999',
        		'parent_ids': ['100', '100'],
        		'email': 'user999@FloridaJewishAcademy.org'
        		}
	newFormIds = {'123': '123'}
	studentsDOM.createStudent(500, newBasicInfo, newFormIds)
	actual = studentsDOM.getInfo(500, 'first_name')
	return expected == actual

def testStudentDeleteStudent():
	expected = None
	studentsDOM.deleteStudent(8)
	actual = studentsDOM.getForm(8, 2)
	return expected == actual

def testStudentRemoveForm():
	expected = None
	studentsDOM.removeForm(4, 4)
	actual = studentsDOM.getForm(4, 4)
	return expected == actual


# ---------------- FORMS -----------------------
def testFormCreateForm():
	newData = {'0': 1000}
	FormsDOM.createForm('1000', '1212-12-12', True, 123, 0.22, newData)
	actual = FormsDOM.getFormData('1000')
	return newData == actual

def testFormGetInfo():
	expected = True
	actual = FormsDOM.getInfo('000', 'required')
	return expected == actual

def testFormGetFormData():
	expected = {'0': 0, '1': 1, '2': 0, '3': 1}
	actual = FormsDOM.getFormData('000')
	return expected == actual

def testFormDeleteForm():
	expected = None
	FormsDOM.deleteForm('020')
	actual = FormsDOM.getFormData('020')
	return expected == actual

def testFormUpdateFormData():
	expected = {'0': 0, '1': 1, '2': 0, '3': 1, '123': 321}
	FormsDOM.updateFormData('010', 123, 321)
	actual = FormsDOM.getFormData('010')
	return actual == expected


# ---------------- USERS -----------------------
def testUsersCreateUser():
	expected = "hello@gmail.com"
	a1 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 3]
	a2 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 0]
	usersDOM.createUser(200, "hello@gmail.com", [a1, a2])
	actual = usersDOM.getEmail(200)
	return actual == expected

def testUsersCreateSameUser():
	expected = -1
	a1 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 3]
	a2 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 0]
	actual = usersDOM.createUser(200, "goodbye@gmail.com", [a1, a2])
	return expected == actual

def testUsersDeleteUser():
	expected = None
	a1 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 3]
	a2 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 0]
	usersDOM.createUser(202, "hello@gmail.com", [a1, a2])
	usersDOM.deleteUser(202)
	actual = usersDOM.getEmail(202)
	return actual == expected

def testUsersUpdateEmail():
	a1 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 3]
	a2 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 0]
	usersDOM.createUser(201, "hello@gmail.com", [a1, a2])
	expected = "test@test.org"
	usersDOM.updateEmail(201, expected)
	actual = usersDOM.getEmail(201)
	return actual == expected

def testUsersGetEmail():
	expected = "hello@gmail.com"
	actual = usersDOM.getEmail(200)
	return actual == expected

def testUsersGetActions():
	a1 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 3]
	a2 = [datetime.datetime(2019, 11, 17, 12, 0, 12), 0]
	expected = [a1, a2]
	actual = usersDOM.getActions(200)
	return actual == expected

def testUsersAddAction():
	expected = [datetime.datetime(2019, 11, 20, 12, 0, 12), 2]
	usersDOM.addAction(201, expected[0], expected[1])
	actual = usersDOM.getActions(201)[-1]
	return actual == expected

## Utilities
def resetDatabase():
    subprocess.call('python3 ../bin/resetDatabase.py', shell=True)


def main():
	# print('RESETTING DATABASE')
	# resetDatabase()
	# print('TEST CASES')
	# print('-----------------STUDENTS-----------------')
	# print('studentsDOM getInfo: ' + str(testStudentGetInfo()))
	# print('studentsDOM updateInfo: ' + str(testStudentUpdateInfo()))
	# print('studentsDOM getForm: ' + str(testStudentGetForm()))
	# print('studentsDOM addForm: ' + str(testStudentAddForm()))
	# print('studentsDOM createStudent: ' + str(testStudentCreateStudent()))
	# print('studentsDOM deleteStudent: ' + str(testStudentDeleteStudent()))
	# print('studentsDOM removeForm: ' + str(testStudentRemoveForm()))
	#
	# print('-------------------FORMS-------------------')
	# print('formsDOM createForm: ' + str(testFormCreateForm()))
	# print('formsDOM getInfo: ' + str(testFormGetInfo()))
	# print('formsDOM getFormData: ' + str(testFormGetFormData()))
	# print('formsDOM deleteForm: ' + str(testFormDeleteForm()))
	# print('formsDOM updateForm: ' + str(testFormUpdateFormData()))
	#
	# print('-------------------USERS-------------------')
	# print('usersDOM createUser: ' + str(testUsersCreateUser()))
	# print('usersDOM createSameUser: ' + str(testUsersCreateSameUser()))
	# print('usersDOM deleteUser: ' + str(testUsersDeleteUser()))
	# print('usersDOM updateEmail: ' + str(testUsersUpdateEmail()))
	# print('usersDOM getEmail: ' + str(testUsersGetEmail()))
	# print('usersDOM getActions: ' + str(testUsersGetActions()))
	# print('usersDOM addAction: ' + str(testUsersAddAction()))
	#
	# print('-------------------PARENTS-------------------')
	# print('ParentsDOM getInfo: ' + str(testParentGetInfo('name', 'parent0')))
	# print('ParentsDOM getInfo: ' + str(testParentGetInfo('DOB', '0000-00-10')))
	# print('ParentsDOM getInfo: ' + str(testParentGetInfo('email', 'parent0@FloridaJewishAcademy.org')))
	# print('ParentsDOM getForm: ' + str(testParentGetForm()))
	# print('ParentsDOM addForm: ' + str(testParentAddForm()))
	# #print('ParentsDOM removeForm: ' + str(testParentRemoveForm()))
	# print('ParentsDOM listStudents: ' + str(testListStudents()))
	return 0

if __name__ == '__main__':
	main()
