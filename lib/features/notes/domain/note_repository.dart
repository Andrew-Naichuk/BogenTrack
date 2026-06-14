import 'note.dart';

abstract class NoteRepository {
  Stream<List<Note>> watchNotes(String userId);

  Future<void> saveNote(Note note);

  Future<void> deleteNote(String noteId);
}
